import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

vi.mock('./components/Layout', () => ({
  default: () => <div data-testid="layout">Layout</div>
}));

vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home">Home</div>
}));

vi.mock('./pages/Appointments', () => ({
  default: () => <div data-testid="appointments">Appointments</div>
}));

vi.mock('./pages/Doctors', () => ({
  default: () => <div data-testid="doctors">Doctors</div>
}));

vi.mock('./pages/Settings', () => ({
  default: () => <div data-testid="settings">Settings</div>
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra la pantalla de carga inicialmente', () => {
    render(<App />);
    expect(screen.getByText('Cargando aplicación...')).toBeInTheDocument();
  });

  it('aplica las preferencias del usuario correctamente', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando aplicación...')).not.toBeInTheDocument();
    });

    expect(document.documentElement.className).toBe('light');
    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('inicializa la base de datos al cargar', async () => {
    const indexedDBService = await import('./services/indexedDB');
    
    render(<App />);
    
    await waitFor(() => {
      expect(indexedDBService.default.initSampleData).toHaveBeenCalledTimes(1);
    });
  });

  it('registra el service worker al cargar', async () => {
    const serviceWorkerRegistration = await import('./services/serviceWorkerRegistration');
    
    render(<App />);
    
    await waitFor(() => {
      expect(serviceWorkerRegistration.register).toHaveBeenCalledTimes(1);
    });
  });
});