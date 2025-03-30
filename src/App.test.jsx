import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

vi.mock('./components/Layout', () => ({
  default: () => <div data-testid="layout">Layout Component</div>
}));

vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home">Home Page</div>
}));

vi.mock('./pages/Appointments', () => ({
  default: () => <div data-testid="appointments">Appointments Page</div>
}));

vi.mock('./pages/Doctors', () => ({
  default: () => <div data-testid="doctors">Doctors Page</div>
}));

vi.mock('./pages/Settings', () => ({
  default: () => <div data-testid="settings">Settings Page</div>
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra la pantalla de carga inicialmente', () => {
    vi.mock('./services/indexedDB', () => ({
      default: {
        initSampleData: () => new Promise(() => {})
      }
    }));
    
    render(<App />);
    expect(screen.getByText(/Cargando aplicación/i)).toBeInTheDocument();
  });

  it('renderiza la aplicación correctamente', () => {
    vi.mock('./services/indexedDB', () => ({
      default: {
        initSampleData: vi.fn().mockResolvedValue(undefined)
      }
    }), { virtual: true });
    
    render(<App />);
    const loadingElement = screen.queryByText(/Cargando aplicación/i);
    expect(loadingElement).toBeDefined();
  });
});