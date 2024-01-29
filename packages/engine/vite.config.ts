import { resolve } from 'path'
import { defineConfig } from 'vite'
import packageJson from './package.json'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: packageJson.name,
        }
    }
})
