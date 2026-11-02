import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Trei pagini separate, nu un SPA cu router: fiecare are propriile meta
  // tag-uri de share și se încarcă fără codul celorlalte. /prezentare e pagina
  // pe care aterizează omul imediat după ce s-a înscris — trebuie să pornească
  // instant, deci cu atât mai puțin are voie să care după ea restul site-ului.
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        mentorat: path.resolve(__dirname, 'mentorat/index.html'),
        prezentare: path.resolve(__dirname, 'prezentare/index.html'),
        gratuit: path.resolve(__dirname, 'gratuit/index.html'),
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
