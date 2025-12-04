import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Permite accesul din afara containerului (echivalent cu --host)
        host: true,
        port: 5173,
        // Esențial pentru Docker pe Windows: forțează verificarea modificărilor
        watch: {
            usePolling: true
        },
        // Configurare strictă pentru portul HMR (WebSocket)
        hmr: {
            clientPort: 5173,
            host: "localhost"
        }
    }
})