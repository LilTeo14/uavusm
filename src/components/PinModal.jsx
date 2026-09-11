import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, User } from 'lucide-react';
import { dbService } from '../services/db';
import { getTeamMember } from '../services/team';

export default function PinModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  targetMember: propTargetMember,
  mode: propMode,
  title, 
  subtitle 
}) {
  const targetMember = propTargetMember || getTeamMember('mateo');
  const isMateo = targetMember?.id === 'mateo';

  // Determinar modo: si el usuario no tiene contraseña aún, forzar 'create', sino 'login'
  const computedMode = propMode || (
    targetMember?.id && !dbService.hasUserPassword(targetMember.id) 
      ? 'create' 
      : 'login'
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset al abrir/cerrar o cambiar de perfil
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
    }
  }, [isOpen, targetMember?.id]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (computedMode === 'create') {
      if (!password || password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor verifica.');
        return;
      }

      try {
        setLoading(true);
        await dbService.setUserPassword(targetMember.id, password);
        setPassword('');
        setConfirmPassword('');
        onSuccess(targetMember);
      } catch (err) {
        setError('Error al guardar la contraseña: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    } else {
      // Modo 'login'
      if (!password) {
        setError('Por favor ingresa tu contraseña.');
        return;
      }

      try {
        setLoading(true);
        const isValid = await dbService.verifyUserPassword(targetMember.id, password);
        if (isValid) {
          setPassword('');
          onSuccess(targetMember);
        } else {
          setError('Contraseña incorrecta. Por favor intenta nuevamente.');
        }
      } catch (err) {
        setError('Error de autenticación: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const isCreating = computedMode === 'create';

  const modalTitle = title || (
    isCreating 
      ? `Crear Contraseña: ${targetMember?.name || 'Usuario'}` 
      : `Acceso a Perfil: ${targetMember?.name || 'Usuario'}`
  );

  const modalSubtitle = subtitle || (
    isCreating 
      ? (isMateo 
          ? '¡Bienvenido Mateo! Por ser tu primera vez, crea tu contraseña de Administrador para proteger tu espacio y permisos directivos.' 
          : `¡Hola ${targetMember?.name}! Es la primera vez que ingresas a este perfil. Crea tu contraseña personal de acceso.`
        )
      : (isMateo
          ? 'Ingresa tu contraseña de Administrador para desbloquear tu espacio y la consola de gestión.'
          : `Ingresa tu contraseña personal para acceder al perfil de ${targetMember?.name}.`
        )
  );

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="modal-content card" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-secondary, #121826)',
        border: isMateo 
          ? '1px solid rgba(14, 165, 233, 0.3)' 
          : targetMember?.color 
            ? `1px solid ${targetMember.color}40` 
            : '1px solid var(--border-color, #243049)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}>
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary, #94a3b8)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '6px'
          }}
          title="Cerrar"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {/* Avatar Icon */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: isMateo 
              ? 'rgba(14, 165, 233, 0.15)' 
              : targetMember?.bgBadge || 'rgba(255, 255, 255, 0.08)',
            color: isMateo 
              ? 'var(--accent-primary, #0ea5e9)' 
              : targetMember?.color || '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            fontSize: '1.6rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {targetMember?.avatar || '👤'}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', padding: '0.15rem 0.5rem', borderRadius: '12px', backgroundColor: isCreating ? 'rgba(16, 185, 129, 0.15)' : 'rgba(14, 165, 233, 0.15)', color: isCreating ? '#10b981' : 'var(--accent-primary, #0ea5e9)', fontSize: '0.72rem', fontWeight: 600 }}>
            {isCreating ? <Sparkles size={12} /> : <Lock size={12} />}
            <span>{isCreating ? 'Primer Ingreso - Crear Clave' : (isMateo ? 'Líder / Administrador' : 'Acceso de Usuario')}</span>
          </div>

          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 600 }}>{modalTitle}</h3>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.45' }}>
            {modalSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input Contraseña */}
          <div style={{ marginBottom: isCreating ? '1rem' : '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text-secondary, #94a3b8)' }}>
              {isCreating ? 'Nueva Contraseña' : 'Tu Contraseña'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isCreating ? 'Mínimo 4 caracteres' : '••••••••'}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  fontSize: '1rem',
                  letterSpacing: showPassword ? 'normal' : '0.15rem',
                  textAlign: showPassword ? 'left' : 'center',
                  backgroundColor: 'var(--bg-tertiary, #0d121f)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-color, #243049)',
                  borderRadius: '10px',
                  color: 'var(--text-primary, #f8fafc)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <KeyRound size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #64748b)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #64748b)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                tabIndex={-1}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Contraseña solo si es modo creación */}
          {isCreating && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text-secondary, #94a3b8)' }}>
                Confirmar Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Repite tu contraseña"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    fontSize: '1rem',
                    letterSpacing: showConfirmPassword ? 'normal' : '0.15rem',
                    textAlign: showConfirmPassword ? 'left' : 'center',
                    backgroundColor: 'var(--bg-tertiary, #0d121f)',
                    border: error ? '1px solid #ef4444' : '1px solid var(--border-color, #243049)',
                    borderRadius: '10px',
                    color: 'var(--text-primary, #f8fafc)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <ShieldCheck size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #64748b)' }} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted, #64748b)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  tabIndex={-1}
                  title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.7rem' }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.4, padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {isCreating ? <ShieldCheck size={15} /> : <Lock size={15} />}
              <span>{loading ? 'Validando...' : (isCreating ? 'Guardar y Entrar' : 'Ingresar')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
