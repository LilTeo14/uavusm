import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Check, Lock, ChevronDown, Globe, Sparkles, Shield, LogOut, KeyRound, Building2
} from 'lucide-react';
import { TEAM_MEMBERS, getTeamMember } from '../services/team';
import { dbService } from '../services/db';

export default function ProfileSelector({ 
  currentProfile, 
  onSelectProfile, 
  isAdmin, 
  authenticatedUser,
  onOpenMateoSpace,
  onOpenPinModal,
  onOpenAuthModal,
  onLogoutAdmin
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({});
  const dropdownRef = useRef(null);

  // Abrir modal de autenticación (soporta ambos nombres de prop para compatibilidad)
  const triggerAuth = (memberId) => {
    const member = getTeamMember(memberId);
    if (onOpenAuthModal) {
      onOpenAuthModal(member);
    } else if (onOpenPinModal) {
      onOpenPinModal(member);
    }
  };

  // Actualizar estado de contraseñas cuando se abre el menú
  useEffect(() => {
    if (isOpen) {
      setPasswordStatus(dbService.getAllUsersPasswordStatus());
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMember = getTeamMember(currentProfile);
  const isGuest = currentProfile === 'guest' || !currentProfile;
  const isMateo = currentProfile === 'mateo';

  const handleProfileClick = (profileId) => {
    setIsOpen(false);
    if (profileId === 'guest') {
      onSelectProfile('guest');
      return;
    }

    // Si ya está autenticado con este perfil en la sesión activa, cambiar directo
    const isCurrentActive = authenticatedUser === profileId || (profileId === 'mateo' && isAdmin);
    if (isCurrentActive) {
      onSelectProfile(profileId);
      return;
    }

    // Si no está autenticado, solicitar PIN/contraseña (o creación si es primera vez)
    triggerAuth(profileId);
  };

  const partnerMembers = TEAM_MEMBERS.filter(m => m.isPartner);
  const regularMembers = TEAM_MEMBERS.filter(m => !m.isMateo && !m.isPartner);

  return (
    <div className="profile-selector-container" ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Botón Principal Selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-pill-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 0.8rem',
          backgroundColor: isMateo 
            ? 'rgba(14, 165, 233, 0.15)' 
            : currentMember?.isPartner
              ? 'rgba(2, 132, 199, 0.15)'
              : isGuest 
                ? 'rgba(100, 116, 139, 0.15)' 
                : 'rgba(255, 255, 255, 0.06)',
          border: isMateo 
            ? '1px solid rgba(14, 165, 233, 0.4)' 
            : currentMember?.isPartner
              ? '1px solid rgba(2, 132, 199, 0.4)'
              : '1px solid var(--border-color, #243049)',
          borderRadius: '24px',
          color: 'var(--text-primary, #f8fafc)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '0.825rem'
        }}
        title="Cambiar perfil o modo de visualización"
      >
        {isGuest ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>🌐</span>
            <span style={{ fontWeight: 600 }}>Vista Pública</span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(148, 163, 184, 0.2)',
              color: 'var(--text-secondary, #94a3b8)'
            }}>
              Showcase
            </span>
          </div>
        ) : isMateo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>👨‍💻</span>
            <span style={{ fontWeight: 600 }}>Mateo</span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(14, 165, 233, 0.25)',
              color: 'var(--accent-primary, #0ea5e9)',
              fontWeight: 600
            }}>
              Líder
            </span>
          </div>
        ) : currentMember?.isPartner ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>{currentMember.avatar}</span>
            <span style={{ fontWeight: 600 }}>{currentMember.name}</span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(2, 132, 199, 0.25)',
              color: '#38bdf8',
              fontWeight: 600
            }}>
              CEO Skydrone
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>{currentMember?.avatar || '👤'}</span>
            <span style={{ fontWeight: 600 }}>{currentMember?.name || 'Usuario'}</span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.4rem', 
              borderRadius: '10px', 
              backgroundColor: currentMember?.bgBadge || 'rgba(255, 255, 255, 0.1)',
              color: currentMember?.color || '#cbd5e1'
            }}>
              Equipo
            </span>
          </div>
        )}
        <ChevronDown size={14} style={{ color: 'var(--text-muted, #64748b)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div 
          className="profile-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            backgroundColor: 'var(--bg-secondary, #121826)',
            border: '1px solid var(--border-color, #243049)',
            borderRadius: '14px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            padding: '0.6rem',
            animation: 'fadeIn 0.15s ease',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}
        >
          {/* Encabezado */}
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color, #243049)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
              Perfiles y Accesos
            </span>
            <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <KeyRound size={11} /> Clave propia
            </span>
          </div>

          {/* Opción 1: Vista Pública / Showcase */}
          <div
            onClick={() => handleProfileClick('guest')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isGuest ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              marginBottom: '0.25rem',
              transition: 'background-color 0.15s'
            }}
            className="dropdown-item-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🌐</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                  Invitado / Vista Pública
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted, #64748b)' }}>
                  Showcase general (solo lectura)
                </div>
              </div>
            </div>
            {isGuest && <Check size={16} style={{ color: 'var(--accent-primary, #0ea5e9)' }} />}
          </div>

          {/* Opción 2: Mateo (Líder / Admin) */}
          {(() => {
            const mateoHasPass = passwordStatus['mateo']?.hasPassword || dbService.hasUserPassword('mateo');
            return (
              <div
                onClick={() => handleProfileClick('mateo')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isMateo ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                  border: isMateo ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
                  marginBottom: '0.4rem',
                  transition: 'background-color 0.15s'
                }}
                className="dropdown-item-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>👨‍💻</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary, #0ea5e9)' }}>
                      Mateo (Líder / Admin)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: !mateoHasPass ? '#10b981' : 'var(--text-muted, #64748b)', fontWeight: !mateoHasPass ? 600 : 400 }}>
                      {isAdmin 
                        ? 'Sesión activa' 
                        : (!mateoHasPass ? 'Primer ingreso: Crear contraseña ✨' : 'Requiere contraseña de acceso')}
                    </div>
                  </div>
                </div>
                {isMateo && isAdmin ? (
                  <Check size={16} style={{ color: 'var(--accent-primary, #0ea5e9)' }} />
                ) : !mateoHasPass ? (
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 600 }}>Crear</span>
                ) : (
                  <Lock size={14} style={{ color: 'var(--text-muted, #64748b)' }} />
                )}
              </div>
            );
          })()}

          {/* Enlaces de Acción para Mateo cuando está activo */}
          {isMateo && isAdmin && (
            <div style={{ padding: '0.4rem 0.5rem', marginBottom: '0.5rem', backgroundColor: 'rgba(14, 165, 233, 0.08)', borderRadius: '8px' }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenMateoSpace();
                }}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', padding: '0.4rem' }}
              >
                <Sparkles size={14} />
                <span>Abrir mi Espacio Privado</span>
              </button>
            </div>
          )}

          {/* Opción 3: Empresa Colaboradora (Nicolás Pazols - Skydrone) */}
          {partnerMembers.length > 0 && (
            <>
              <div style={{ padding: '0.4rem 0.75rem 0.25rem 0.75rem', borderTop: '1px solid var(--border-color, #243049)', marginTop: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building2 size={11} /> Empresa Colaboradora (Skydrone)
                </span>
              </div>
              <div>
                {partnerMembers.map(member => {
                  const isSelected = currentProfile === member.id;
                  const hasPass = passwordStatus[member.id]?.hasPassword || dbService.hasUserPassword(member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => handleProfileClick(member.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
                        fontSize: '0.8rem',
                        transition: 'background-color 0.15s',
                        marginBottom: '0.2rem'
                      }}
                      className="dropdown-item-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{member.avatar}</span>
                        <div>
                          <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.82rem' }}>
                            {member.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: !hasPass ? '#10b981' : 'var(--text-muted, #64748b)', fontWeight: !hasPass ? 600 : 400 }}>
                            {member.role.split('/')[0].trim()} {!hasPass && '• Crear clave ✨'}
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check size={14} style={{ color: '#38bdf8' }} />
                      ) : !hasPass ? (
                        <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600 }}>Crear</span>
                      ) : (
                        <Lock size={13} style={{ color: 'var(--text-muted, #64748b)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Separador: Integrantes del Equipo */}
          <div style={{ padding: '0.4rem 0.75rem 0.25rem 0.75rem', borderTop: '1px solid var(--border-color, #243049)', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
              Equipo UAVUSM
            </span>
          </div>

          {/* Lista de Miembros Regulares */}
          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {regularMembers.map(member => {
              const isSelected = currentProfile === member.id;
              const hasPass = passwordStatus[member.id]?.hasPassword || dbService.hasUserPassword(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => handleProfileClick(member.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    fontSize: '0.8rem',
                    transition: 'background-color 0.15s'
                  }}
                  className="dropdown-item-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{member.avatar}</span>
                    <div>
                      <div style={{ color: member.color, fontWeight: 500 }}>{member.name}</div>
                      <div style={{ fontSize: '0.68rem', color: !hasPass ? '#10b981' : 'var(--text-muted, #64748b)' }}>
                        {member.role.split('/')[0].trim()} {!hasPass && '• Crear clave ✨'}
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <Check size={14} style={{ color: member.color }} />
                  ) : !hasPass ? (
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600 }}>Crear</span>
                  ) : (
                    <Lock size={12} style={{ color: 'var(--text-muted, #64748b)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón de salir de sesión si hay un perfil activo */}
          {!isGuest && (
            <div style={{ borderTop: '1px solid var(--border-color, #243049)', marginTop: '0.5rem', paddingTop: '0.4rem' }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogoutAdmin();
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.4rem'
                }}
              >
                <LogOut size={13} />
                <span>Bloquear y volver a Vista Pública</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
