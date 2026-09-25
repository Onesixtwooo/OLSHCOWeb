import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    publicDir: false,
    plugins: [
        react(),
    ],
    build: {
        manifest: 'manifest.json',
        outDir: 'public/build',
        rollupOptions: {
            input: {
                app: 'resources/js/app.jsx',
                admin: 'resources/js/admin.jsx',
            },
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        origin: 'http://127.0.0.1:5173',
        cors: true,
    },
});
