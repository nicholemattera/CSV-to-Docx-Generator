import { defineConfig } from 'vite'

if (process.env.NODE_ENV === 'production' && process.env.GITHUB_REF_NAME) {
  process.env.VITE_PACKAGE_VERSION = process.env.GITHUB_REF_NAME
} else {
  process.env.VITE_PACKAGE_VERSION = ''
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: './',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        sw: 'src/sw.js',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'sw' ? '[name].js' : '[name]-[hash].js'
        },
      },
    },
  },
})
