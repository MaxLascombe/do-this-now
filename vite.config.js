import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgrPlugin()],
    define: {
        // By default, Vite doesn't include shims for NodeJS/
        // necessary for segment analytics lib to work
        global: {},
    },
})
