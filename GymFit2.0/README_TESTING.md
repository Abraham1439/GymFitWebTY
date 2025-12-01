# Guía de Testing - GymFitWeb 2.0

Este documento describe la configuración y uso del entorno de pruebas unitarias del proyecto.

## Configuración

El proyecto utiliza **Vitest** para las pruebas unitarias del frontend. Vitest es un framework de testing moderno, rápido y compatible con Vite, TypeScript y React.

### Dependencias Instaladas

- `vitest`: Framework de testing rápido y moderno
- `@vitest/coverage-v8`: Reporter de cobertura de código
- `@vitest/ui`: Interfaz de usuario para visualizar pruebas
- `@testing-library/react`: Utilidades para probar componentes React
- `@testing-library/jest-dom`: Matchers adicionales para DOM
- `@testing-library/user-event`: Simulación de eventos de usuario
- `jsdom`: Entorno DOM simulado para pruebas

## Estructura de Pruebas

```
tests/
└── unit/                   # Pruebas unitarias
    ├── helpers/           # Pruebas de helpers
    ├── services/          # Pruebas de servicios
    ├── pages/             # Pruebas de componentes
    └── contexts/          # Pruebas de contextos

src/
└── __mocks__/             # Mocks para servicios y contextos
    ├── contexts/
    └── services/
```

## Ejecutar Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch (auto-reload)
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura
```bash
npm run test:coverage
```

### Ejecutar pruebas con interfaz de usuario
```bash
npm run test:watch -- --ui
```

Los reportes de cobertura se generan en la carpeta `coverage/`.

## Cobertura de Código

El proyecto está configurado para verificar que la cobertura de código sea al menos del 80% en:
- Statements (declaraciones)
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)

## Pruebas Implementadas

### Helpers
- ✅ `validation.helpers.spec.ts` - Validaciones de formularios
- ✅ `local-storage.helpers.spec.ts` - Manejo de localStorage
- ✅ `capitalize-first.helpers.spec.ts` - Utilidades de texto

### Servicios
- ✅ `productosService.spec.ts` - Servicio de productos (con mocks)
- ✅ `usuariosService.spec.ts` - Servicio de usuarios (con mocks)

### Componentes
- ✅ `LoginPage.spec.tsx` - Componente de login

### Contextos
- ✅ `CartContext.spec.ts` - Contexto del carrito (con mocks)

## Mocks

Los mocks están ubicados en `src/__mocks__/` y simulan el comportamiento de:
- Servicios de API
- Contextos de React
- Funciones externas

## Configuración de Vitest

El archivo `vitest.config.ts` contiene la configuración del test runner, incluyendo:
- Entorno: jsdom (simulación de DOM del navegador)
- Patrones de archivos: `tests/unit/**/*.{test,spec}.{ts,tsx}`
- Cobertura: Configurada con v8 provider
- Thresholds: 80% mínimo en statements, branches, functions y lines
- Setup: Archivo `tests/setup.ts` se ejecuta antes de cada prueba

## Notas

- Las pruebas utilizan mocks para aislar las unidades de código
- Los componentes de React se prueban usando `@testing-library/react`
- La cobertura de código se genera automáticamente al ejecutar `test:coverage`
- Vitest es compatible con la sintaxis de Jest/Vitest (describe, it, test, expect)
- El entorno jsdom simula un navegador completo para las pruebas de componentes

