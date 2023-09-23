import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            manifest: {
                name: 'familyApp',
                short_name: 'familyApp',
                display: 'standalone',
                lang: 'de',
                icons: [
                    {
                        src: 'assets/img/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => {
                            return url.pathname.startsWith('/google');
                        },
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'firebase-cache',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
    ],
    base: './',
    server: {
        port: 4200,
    },
});
