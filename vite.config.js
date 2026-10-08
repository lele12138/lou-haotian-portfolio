import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        reactToHarness: resolve(process.cwd(), 'blog/react-to-harness/index.html'),
        agentMemory: resolve(process.cwd(), 'blog/agent-memory/index.html'),
      },
    },
  },
})
