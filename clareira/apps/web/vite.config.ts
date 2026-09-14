import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Porta 5273 — própria deste projeto, separada de qualquer implementação
 * anterior (seção 1 do briefing). A API roda na 5274.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5273,
    strictPort: true,
    proxy: {
      '/v1': {
        target: process.env.CLAREIRA_API ?? 'http://127.0.0.1:5274',
        changeOrigin: true,
      },
    },
  },
  preview: { port: 5273, strictPort: true },
  build: {
    target: 'es2022',
    // Sem sourcemap em produção por padrão; ligado por variável quando preciso.
    sourcemap: process.env.CLAREIRA_SOURCEMAP === '1',
  },
});
