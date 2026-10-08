# 从 ReAct 到 Harness：一个 Agent 是怎样跑起来的

今天我们谈 Agent，常常会听到规划、记忆、多 Agent、Skills、MCP、沙箱等一长串概念。但如果把这些复杂能力全部拿掉，一个 Agent 最小可以小到什么程度？

我的理解是：**ReAct 加上 Function Calling，再配一段负责执行与回传结果的循环代码，就可以组成一个最小 Agent。**

这里首先要纠正两个容易混淆的写法：本文说的是 **ReAct**，不是前端框架 React；是 **Function Calling**，不是 Function Code。ReAct 让模型在“思考下一步”和“采取行动”之间循环，Function Calling 则让行动不再是一句自然语言，而是一个结构化、可被程序接住的工具调用请求。

这个最小结构能让模型从“回答问题”走向“尝试完成任务”。而当它继续走向真实业务，我们就会遇到另一个更重要的概念：Harness。

## 一、ReAct 是什么

ReAct 是 **Reasoning and Acting** 的缩写。它来自 2022 年提出、后发表于 ICLR 2023 的同名论文。论文的核心并不复杂：让大语言模型交替地产生推理和行动，并把行动从环境中得到的新信息，继续作为下一步判断的依据。[ReAct 论文](https://arxiv.org/abs/2210.03629)

一个最经典的 ReAct 循环可以写成：

```text
观察 Observation
    ↓
判断下一步 Reason
    ↓
选择并发起行动 Act
    ↓
获得新的观察 Observation
    ↓
继续判断，直到完成或终止
```

普通聊天模型更像一次性的映射：

```text
用户输入 → 模型 → 文本回答
```

ReAct 则把一次回答改造成了一个闭环：

```text
用户目标 → 模型判断 → 执行动作 → 环境反馈 → 模型再判断 → …… → 结果
```

例如，用户说：“帮我查一下上海明天会不会下雨，如果下雨就提醒我带伞。”

模型本身不知道明天的实时天气。它需要先判断“我缺少天气信息”，再选择天气查询工具；程序执行查询后，把结果作为新的 Observation 返回。如果结果显示有雨，模型再决定创建提醒；如果没有雨，就直接回复用户。这里真正重要的不是模型一次猜对答案，而是它会根据环境反馈修正下一步行动。

ReAct 因而包含三个关键变化：

1. **目标不再要求一次完成。** 模型可以把任务拆成多步。
2. **外部结果会改变后续决策。** 搜索结果、数据库记录、代码运行输出都可以成为新的观察。
3. **失败也进入循环。** 工具报错、参数缺失或结果为空，不必直接结束，可以触发澄清、重试或改换路径。

需要注意的是，ReAct 是一种“推理—行动—观察”的系统范式，并不等于必须向用户展示模型完整的内部思维过程。在实际产品中，我们更关心可观察的计划、工具选择、参数、结果和状态变化，而不是要求模型输出冗长的隐式推理。

## 二、Function Calling 怎样把行动变成真实动作

如果只有 ReAct，模型可能只是输出一句：

> 我接下来需要查询上海天气。

这仍然只是一段文本。Function Calling 的作用，是把“我想做什么”转换为机器可识别的调用请求，例如：

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "上海",
    "date": "tomorrow"
  }
}
```

应用程序收到这个请求后，完成参数校验、权限检查和函数执行，再把结果回传给模型。OpenAI 的 Function Calling 文档把完整过程概括为五步：向模型提供工具、接收工具调用、由应用侧执行代码、把工具结果再次发给模型、获得最终回复或下一次工具调用。[OpenAI Function Calling 文档](https://developers.openai.com/api/docs/guides/function-calling)

所以，**Function Calling 本身并不会替你执行函数**。模型只是提出一个结构化的行动请求，真正的执行权仍在模型外部的程序手里。

把两者合起来，一个最小 Agent 大致如下：

```python
messages = [user_request]

for step in range(MAX_STEPS):
    response = model(messages, tools=tool_schemas)

    if response.is_final_answer:
        return response.text

    call = validate(response.tool_call)
    result = execute(call)
    messages.append(call)
    messages.append(result)

raise StepLimitExceeded()
```

短短几行伪代码已经具备 Agent 的基本特征：模型能读取目标、决定下一步、调用外部能力、观察结果，并持续运行到任务完成。

因此，更严谨的表达不是简单的：

```text
Agent = ReAct + Function Calling
```

而是：

```text
最小 Agent = Model + ReAct 循环 + Function Calling + 工具执行环境
```

ReAct 提供行为模式，Function Calling 提供模型与程序之间的结构化接口，宿主程序则让调用真正发生。

## 三、Harness 是什么

当工具只有一两个、任务只有两三步时，上面的循环已经够用。但只要 Agent 开始接触真实系统，问题就会迅速出现：

- 它能调用哪些工具，不能调用哪些工具？
- 参数错了由谁拦截？
- 同一个付款请求因为超时被重试两次怎么办？
- 运行到一半需要人工审批，如何暂停和恢复？
- 上下文过长时，哪些信息应该保留？
- Agent 说任务完成了，谁来确认真的完成了？
- 模型换了以后，原来的工具、权限和评测还能不能复用？

这些问题都不应该只靠模型“自觉”。它们属于 Harness。

在英文里，harness 原本指套在马身上的挽具或马具：它一方面把马与车辆或负载连接起来，另一方面帮助人控制和引导这股力量。[Cambridge Dictionary 对 harness 的释义](https://dictionary.cambridge.org/dictionary/english/harness)

这个比喻非常适合 Agent：

| 马具系统 | Agent 系统 |
| --- | --- |
| 马提供力量 | Model 提供理解、推理和生成能力 |
| 缰绳传递方向 | Prompt、上下文和策略传递目标与约束 |
| 挽具连接负载 | Tool Schema、API 和执行器连接外部系统 |
| 车夫控制节奏 | Orchestrator 控制循环、暂停和终止 |
| 制动与护具限制风险 | 权限、校验、审批、沙箱和 Guardrails 限制风险 |
| 车辙与里程记录过程 | Trace、日志、状态和回执记录执行事实 |

马有力量，但没有马具，它无法稳定地拉动车辆；模型有能力，但没有 Harness，它的能力也很难稳定地转化成真实任务结果。

因此可以用一个很有帮助、但不是严格数学定义的公式来理解：

```text
Agent = Model + Harness
Harness ≈ Agent - Model
```

也就是说，**把模型本身拿掉以后，剩下所有让模型能够持续获取上下文、选择工具、安全执行、记录状态、恢复任务并接受评测的系统，都可以视为 Harness。** OpenAI 当前的工程文档也把 Harness 描述为模型周围的控制面，负责 Agent 循环、模型调用、工具路由、Handoff、审批、Tracing、恢复和运行状态。[OpenAI Sandbox Agents 文档](https://developers.openai.com/api/docs/guides/agents/sandboxes)

这个边界在不同框架中会略有差异，但它比“Agent 就是一个更强的模型”更接近真实工程。

## 四、从 ReAct 到 Harness 的演进脉络

Agent 的演进，不只是模型变强，更是模型周围的工程层不断变厚。

### 1. Prompt 阶段：让模型给出答案

最初的 LLM 应用主要是单轮或多轮对话。开发者设计 Prompt，模型生成文本，程序把文本展示给用户。此时模型可以提出建议，但没有直接接触环境的能力。

### 2. ReAct 阶段：让模型根据反馈连续决策

ReAct 把推理与行动交错起来。模型不必在第一次调用时知道全部答案，而是可以边做边看：先搜索，再阅读；先检查文件，再修改；先尝试执行，再根据报错调整。

Agent 的核心由此从“生成一段答案”变成“运行一个闭环”。

### 3. Function Calling 阶段：让行动结构化

早期 ReAct 常用文本格式表达 `Thought / Action / Observation`，解析容易出错。Function Calling 用明确的工具名和参数 Schema 替代自由文本动作，使模型的调用意图能够被程序稳定解析。

这一阶段确立了一个重要边界：模型负责**提出调用**，应用负责**校验与执行**。

### 4. Augmented LLM 阶段：补上检索、工具与记忆

随着应用复杂度增加，模型外部开始加入 Retrieval、Tools 和 Memory。Anthropic 将它概括为 augmented LLM，并进一步区分固定代码路径的 Workflow 与由模型动态决定过程和工具使用的 Agent。[Anthropic《Building effective agents》](https://www.anthropic.com/engineering/building-effective-agents)

这时系统不再只是一个工具循环，还要解决工具选择、上下文拼装、任务路由、并行执行和结果聚合。

### 5. Workflow 与 Orchestration 阶段：把长任务拆开

当任务变长，单一循环开始出现上下文膨胀、错误累积和恢复困难。工程上于是出现 Prompt Chaining、Routing、Parallelization、Orchestrator–Workers、Evaluator–Optimizer 等模式。

关键变化是：并非每一步都必须交给模型自由决定。可预测的流程可以写进代码；只有真正需要语义判断和动态规划的部分，才交给模型。

### 6. Production Harness 阶段：把 Agent 变成可靠系统

进入生产环境后，Agent 不只要“能跑”，还要可控、可恢复、可审计、可评测。Harness 开始拥有持久化状态、权限边界、人工审批、沙箱、检查点、Handoff、Tracing、预算控制和失败恢复。

到这个阶段，Agent 的主要工程难题已经不是再写一段更长的 Prompt，而是设计模型可以理解、环境可以执行、系统可以验证的反馈闭环。OpenAI 在 Harness Engineering 的实践总结中也强调：当 Agent 缺少工具、抽象和内部结构时，简单地要求它“更努力”并不能解决问题；需要补的是环境、可读性、约束和反馈回路。[OpenAI《Harness engineering》](https://openai.com/index/harness-engineering/)

## 五、一个生产级 Harness 通常包含什么

一个相对完整的 Harness，至少会覆盖以下层次：

1. **Instructions 与 Context**：系统指令、业务规则、当前任务、历史状态，以及按需检索到的资料。
2. **Agent Loop**：控制何时调用模型、何时执行工具、何时继续、暂停或结束。
3. **Tool Registry 与 Router**：登记工具能力，根据任务只暴露必要的候选工具，避免工具数量无限膨胀。
4. **Validator 与 Policy**：验证参数、状态、权限、预算和业务规则，拒绝不合法的行动。
5. **Executor 与 Sandbox**：真正执行 API、代码或设备动作，并隔离高风险环境。
6. **State、Memory 与 Checkpoint**：保存会话状态、任务进度和可恢复快照，而不是把所有信息都塞进上下文窗口。
7. **Approval 与 Handoff**：在付款、发布、删除、合并等高风险节点请求人工批准，或把任务移交给其他 Agent 和人员。
8. **Trace、Ledger 与 Receipt**：记录模型提出了什么、系统执行了什么、环境实际发生了什么。
9. **Evaluation 与 Feedback**：用离线用例、回归测试、线上指标和失败样本持续评估 Model 与 Harness 的组合效果。

其中有一个特别重要的原则：

```text
模型提出行动
Harness 判断行动是否合法
Executor 记录实际执行结果
环境或独立 Evaluator 判断任务是否成功
```

不要让同一个模型既提出动作、又宣判动作合法、再宣布自己已经成功。职责分离是 Agent 从 Demo 走向工程系统的第一步。

## 六、Harness 的工程实践要点

### 1. 先定义契约，再接模型

工具要有明确的名称、输入 Schema、输出结构、错误类型和副作用说明。不要让模型猜某个字段的含义，也不要用一大段模糊文本承载本可结构化的状态。

输入输出一旦结构化，校验、回放、测试和替换模型都会简单很多。

### 2. 模型负责判断，代码负责确定性流程

如果后续参数能够由已有结果确定，就让代码计算；如果流程固定，就让状态机推进；如果涉及语义判断、模糊目标或异常路径，再让模型参与。

这不是削弱 Agent，而是把有限的模型调用留给真正需要智能的地方。OpenAI 的 Programmatic Tool Calling 指南也建议：可预测的数据流适合交给代码，涉及新语义判断、审批和高风险写入的步骤则应保留清晰边界。[OpenAI Programmatic Tool Calling 文档](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)

### 3. 不相信“我已经完成”，只相信可验证证据

Agent 说“文件已经生成”并不代表文件存在；说“部署成功”也不代表页面可访问。Harness 应要求可检查的完成条件，例如文件哈希、测试结果、HTTP 状态、数据库版本、截图或执行回执。

完成状态应该来自环境事实，而不是模型的自我陈述。

### 4. 为副作用设计幂等性

网络超时只说明调用方没有收到结果，不代表动作没有发生。付款、发消息、创建工单等操作都应携带稳定的 `request_id` 或幂等键。重试前先查询原请求状态，避免一次任务被执行两遍。

### 5. 把权限、审批和执行隔离开

最小权限原则同样适用于 Agent。查询工具和写入工具应分开；低风险动作可以自动执行，高风险动作需要显式批准；敏感凭证保留在执行环境中，不进入模型上下文。

模型可以提出“删除”或“发布”，但最终授权必须由 Harness 和用户掌握。

### 6. 为循环设置边界

Agent 不能无限思考、无限调用、无限重试。Harness 需要限制模型轮次、工具次数、Token、费用、运行时间和重试次数，并定义 `completed`、`failed`、`blocked`、`cancelled` 等明确终态。

边界不是附加项，而是闭环的一部分。

### 7. 让上下文可发现，而不是全部塞进去

更长的 Prompt 不等于更好的 Harness。应给模型一个稳定入口，再通过检索、目录、Skills 或工具按需加载细节。规则需要有唯一可信来源，过期文档需要能够被检测。

这是一种面向 Agent 的“渐进披露”：先让它知道去哪里找，再在需要时读取具体内容。

### 8. 记录决策，也记录事实

一次运行至少应该能够回答：模型看到了什么、选择了什么工具、传了什么参数、系统执行了什么、返回了什么、为什么重试、在哪里终止。

Trace 用来调试模型与流程，Ledger 用来保存不可变的行为记录，Receipt 用来证明外部动作是否真正发生。三者共同构成可审计性。

### 9. 分开评测 Model 和 Harness

Agent 的最终表现是模型与 Harness 的共同结果。模型选错工具，不等于执行器有问题；参数正确却被错误拒绝，也不等于模型能力不足。

评测时至少要分层观察：

- 模型是否理解目标并选对行动；
- 工具参数是否正确；
- Harness 是否正确校验、路由和恢复；
- Executor 是否产生预期副作用；
- 最终任务是否在真实环境中完成。

更换模型、Prompt、工具定义或编排方式时，尽量一次只改变一个主要变量。否则即使指标变化，也很难知道到底是哪一层带来的。

## 七、重新理解 Agent 的核心

回到开头，ReAct 加 Function Calling 的确可以构成一个最小 Agent。它让模型从“生成一句话”跨越到“根据反馈采取下一步行动”。

但最小 Agent 与可靠 Agent 之间，隔着整个 Harness：

```text
ReAct 解决：下一步做什么
Function Calling 解决：怎样把行动表达给程序
Harness 解决：这个行动能否被安全、持续、可恢复地执行
```

模型决定了 Agent 能想到什么，Harness 决定了这些能力能否稳定地进入真实世界。

所以，未来 Agent 工程的竞争未必只是“谁用了更强的模型”，也会是：谁能为模型提供更清晰的环境、更合适的工具、更严格的边界、更及时的反馈，以及更可信的完成证据。

一匹更强的马当然重要。但只有马具、道路、车夫和制动系统共同存在，它的力量才会真正抵达目的地。

