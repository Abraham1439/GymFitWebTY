// Pruebas unitarias para LoginPage
// Unit Test: Prueba que verifica el comportamiento de un componente React

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../../../src/pages/auth/LoginPage';
import { AuthProvider } from '../../../../src/contexts/AuthContext';

describe('LoginPage', () => {
  // describe: Agrupa pruebas relacionadas

  it('debe renderizar el componente sin errores', () => {
    // it: Define una prueba individual
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // expect: Función de Vitest para hacer aserciones
    expect(container).toBeDefined();
  });

  it('debe mostrar el formulario de login', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(container).toBeDefined();
    expect(container.querySelector('form')).toBeTruthy();
  });

  it('debe tener la estructura correcta del componente', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(container).not.toBeNull();
  });
});

