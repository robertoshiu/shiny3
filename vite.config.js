import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: 'src/pages',
  base: '/shiny3/',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        solutions: resolve(__dirname, 'src/pages/solutions.html'),
        technology: resolve(__dirname, 'src/pages/technology.html'),
        'case-studies': resolve(__dirname, 'src/pages/case-studies.html'),
        careers: resolve(__dirname, 'src/pages/careers.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        404: resolve(__dirname, 'src/pages/404.html'),
      },
    },
  },
});
