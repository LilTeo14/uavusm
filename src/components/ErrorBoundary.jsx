import React from 'react';
import { ShieldAlert, RefreshCw, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: this.props.fullScreen ? '100vh' : '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: this.props.fullScreen ? 'var(--bg-primary, #0d1117)' : 'transparent'
        }}>
          <div style={{
            maxWidth: '680px',
            width: '100%',
            backgroundColor: 'var(--card-bg, #161b22)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderLeft: '4px solid var(--state-danger, #ef4444)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                padding: '0.6rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-primary, #f0f6fc)', fontSize: '1.25rem', fontWeight: 600 }}>
                  {this.props.title || 'Error al renderizar esta vista'}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary, #8b949e)', fontSize: '0.85rem' }}>
                  Se produjo un error inesperado al procesar la interfaz.
                </p>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary, #8b949e)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {this.state.error?.message || 'Error desconocido en tiempo de ejecución.'}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                onClick={this.handleReset}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              >
                <RotateCcw size={14} /> Reintentar vista
              </button>
              <button
                onClick={this.handleReload}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              >
                <RefreshCw size={14} /> Recargar página
              </button>
            </div>

            {this.state.error && (
              <details style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--text-muted, #6b7280)', fontSize: '0.8rem', fontWeight: 500 }}>
                  Ver detalles técnicos del error
                </summary>
                <pre style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
