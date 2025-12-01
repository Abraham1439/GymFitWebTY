import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno de pruebas
    environment: 'jsdom',
    // Glob patterns para encontrar archivos de prueba
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.spec.{ts,tsx}'],
    // Configuración de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/vite-env.d.ts'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    // Configuración de globals
    globals: true,
    // Setup files
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
});

