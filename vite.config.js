import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        inject({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery', // Ensures jQuery is available globally
        }),
    ],
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery.min.js', // Use the minified version
        },
    },
});
