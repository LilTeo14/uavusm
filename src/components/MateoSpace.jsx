import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, Plus, Trash2, Edit2, CheckCircle2, 
  Clock, Shield, ArrowRight, AlertTriangle, Tag, Check,
  Layers, Folder, Calendar, User, ExternalLink, X,
  KeyRound, RotateCcw, ShieldCheck, Lock
} from 'lucide-react';
import { dbService } from '../services/db';

export default function MateoSpace({ 
  projects = [], 
  tasks = [], 
  materials = [], 
  onNavigate,
  onSelectProject,
  onLogout
}) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [hasMateoPassword, setHasMateoPassword] = useState(() => dbService.hasUserPassword('mateo'));

  const handleResetMyPassword = async () => {
    if (window.confirm('¿Seguro que deseas restablecer tu propia contraseña de Administrador (Mateo)? Quedarás sin contraseña y la próxima vez que ingreses se te solicitará crear una nueva clave.')) {
      try {
        await dbService.removeUserPassword('mateo');
        setHasMateoPassword(false);
        alert('Has restablecido tu contraseña. Tu perfil de Mateo ahora no tiene contraseña asignada y requerirá crear una nueva al iniciar sesión.');
      } catch (err) {
        alert('Error al restablecer contraseña: ' + (err.message || err));
      }
    }
  };

  const handleChangeMyPassword = async () => {
    const newPass = window.prompt('Ingresa tu nueva contraseña de Administrador (mínimo 4 caracteres):');
    if (newPass === null) return;
    if (newPass.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    try {
      await dbService.setUserPassword('mateo', newPass.trim());
      setHasMateoPassword(true);
      alert('¡Tu contraseña de Administrador ha sido guardada exitosamente!');
    } catch (err) {
      alert('Error al actualizar contraseña: ' + (err.message || err));
    }
  };

  // Formulario de Nota
  const [noteForm, setNoteForm] = useState({
    title: '',
    project_tag: 'Skydoc',
    priority: 'high',
    content: ''
  });

  // Cargar notas al montar
  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await dbService.getMateoNotes();
      setNotes(data);
    } catch (err) {
      console.error('Error al cargar notas de Mateo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Guardar o Actualizar Nota
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;

    try {
      if (editingNoteId) {
        await dbService.updateMateoNote(editingNoteId, noteForm);
      } else {
        await dbService.createMateoNote(noteForm);
      }
      setNoteForm({ title: '', project_tag: 'Skydoc', priority: 'normal', content: '' });
      setIsCreatingNote(false);
      setEditingNoteId(null);
      await loadNotes();
    } catch (err) {
      alert('Error al guardar la nota: ' + err.message);
    }
  };

  // Comenzar Edición
  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setNoteForm({
      title: note.title,
      project_tag: note.project_tag || 'General',
      priority: note.priority || 'normal',
      content: note.content
    });
    setIsCreatingNote(true);
  };

  // Eliminar Nota
  const handleDeleteNote = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta nota directiva?')) return;
    try {
      await dbService.deleteMateoNote(id);
      await loadNotes();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  // Alternar Estado de Resuelta
  const handleToggleResolve = async (note) => {
    try {
      const nextStatus = note.status === 'resolved' ? 'pending' : 'resolved';
      await dbService.updateMateoNote(note.id, { status: nextStatus });
      await loadNotes();
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  // Filtrar tareas donde participa Mateo
  const mateoTasks = tasks.filter(t => {
    if (!t.assigned_to) return false;
    const lower = t.assigned_to.toLowerCase();
    return lower.includes('mateo');
  });

  // Gastos pendientes de aprobación
  const pendingApprovalsCount = materials.filter(m => m.status === 'pending').length;

  return (
    <div className="mateo-space" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Banner Principal de Liderazgo */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍💻</span>
              <span className="status-pill approved" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Perfil de Dirección Técnica Activo
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0', fontFamily: 'var(--font-display)' }}>
              Espacio de Mateo
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary, #94a3b8)', fontSize: '0.92rem', maxWidth: '700px' }}>
              Área privada para gestión de directrices técnicas, notas estratégicas de desarrollo y control transversal de proyectos y aprobaciones.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('admin')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px' }}
            >
              <Shield size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>Consola Admin</span>
              {pendingApprovalsCount > 0 && (
                <span style={{ 
                  backgroundColor: '#f97316', 
                  color: 'white', 
                  fontSize: '0.65rem', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '10px',
                  fontWeight: 700 
                }}>
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
            <button 
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px', color: '#ef4444' }}
              title="Cerrar sesión de Mateo y regresar a vista pública"
            >
              <X size={14} />
              <span>Bloquear Sesión</span>
            </button>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              backgroundColor: 'rgba(14, 165, 233, 0.15)', 
              color: 'var(--accent-primary, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{notes.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Notas Directivas</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              backgroundColor: 'rgba(16, 185, 129, 0.15)', 
              color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {mateoTasks.filter(t => t.status === 'done').length} / {mateoTasks.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Mis Tareas Completadas</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              backgroundColor: 'rgba(249, 115, 22, 0.15)', 
              color: '#f97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{pendingApprovalsCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Materiales por Aprobar</div>
            </div>
          </div>
        </div>
      </div>

      {/* TARJETA DE SEGURIDAD Y ACCESO DE MATEO */}
      <div className="card" style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        padding: '1.25rem 1.5rem',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(14, 165, 233, 0.15)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <KeyRound size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Seguridad y Mi Contraseña de Administrador</h4>
              {hasMateoPassword ? (
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={11} /> Configurada
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={11} /> Sin Contraseña
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {hasMateoPassword 
                ? 'Tu acceso privado y consola directiva están protegidos por tu contraseña personal.' 
                : 'Actualmente no tienes contraseña configurada. Puedes crear una ahora o en tu próximo ingreso.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleChangeMyPassword}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
          >
            <KeyRound size={13} />
            <span>{hasMateoPassword ? 'Cambiar mi Contraseña' : 'Crear mi Contraseña'}</span>
          </button>

          {hasMateoPassword && (
            <button
              onClick={handleResetMyPassword}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.3)' }}
              title="Volver a dejar a Mateo sin contraseña para que pida crear una nueva en el próximo ingreso"
            >
              <RotateCcw size={13} />
              <span>Dejarme sin contraseña</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('admin')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
          >
            <Shield size={13} />
            <span>Gestionar Claves del Equipo →</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: BLOC DE NOTAS PRIVADAS DE MATEO */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
              Notas de Dirección Técnica y Decisiones
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Solo visibles por Mateo con sesión autenticada. No accesibles para invitados o externos.
            </p>
          </div>

          {!isCreatingNote && (
            <button
              onClick={() => {
                setEditingNoteId(null);
                setNoteForm({ title: '', project_tag: 'Skydoc', priority: 'normal', content: '' });
                setIsCreatingNote(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Nueva Nota Directiva</span>
            </button>
          )}
        </div>

        {/* Formulario de Creación / Edición */}
        {isCreatingNote && (
          <div className="card" style={{
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            backgroundColor: 'rgba(18, 24, 38, 0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                {editingNoteId ? 'Editar Nota de Dirección' : 'Redactar Nueva Nota de Liderazgo'}
              </h4>
              <button 
                onClick={() => {
                  setIsCreatingNote(false);
                  setEditingNoteId(null);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Título de la Decisión / Nota
                  </label>
                  <input
                    type="text"
                    required
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="Ej. Decisión Prototipado Cierre Hermético..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Proyecto / Área
                  </label>
                  <select
                    value={noteForm.project_tag}
                    onChange={(e) => setNoteForm({ ...noteForm, project_tag: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Skydoc">Skydoc</option>
                    <option value="Skybetol">Skybetol</option>
                    <option value="Skycopter">Skycopter</option>
                    <option value="Avión 3D">Avión Impreso en 3D</option>
                    <option value="General">Iniciativa UAVUSM General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Prioridad
                  </label>
                  <select
                    value={noteForm.priority}
                    onChange={(e) => setNoteForm({ ...noteForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="high">Alta (Decisión Inmediata)</option>
                    <option value="normal">Normal</option>
                    <option value="low">Baja / Referencia</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Contenido / Razonamiento y Siguientes Pasos
                </label>
                <textarea
                  required
                  rows={4}
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="Detalla el problema, alternativas evaluadas y con quién debe coordinarse..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNote(false);
                    setEditingNoteId(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Check size={14} />
                  <span>{editingNoteId ? 'Guardar Cambios' : 'Crear Nota'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listado de Notas */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando notas de Mateo...</p>
        ) : notes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <FileText size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
            <p>No tienes notas registradas aún.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
            {notes.map(note => {
              const isResolved = note.status === 'resolved';
              const isHighPriority = note.priority === 'high';

              return (
                <div 
                  key={note.id} 
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: isResolved 
                      ? '1px solid rgba(16, 185, 129, 0.3)' 
                      : isHighPriority 
                        ? '1px solid rgba(239, 68, 68, 0.35)' 
                        : '1px solid var(--border-color)',
                    backgroundColor: isResolved ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-secondary)',
                    opacity: isResolved ? 0.75 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    {/* Tags y Prioridad */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '6px',
                          backgroundColor: 'rgba(14, 165, 233, 0.15)',
                          color: 'var(--accent-primary)'
                        }}>
                          {note.project_tag || 'General'}
                        </span>
                        {isHighPriority && (
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem', 
                            borderRadius: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444'
                          }}>
                            Alta Prioridad
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button
                          onClick={() => handleToggleResolve(note)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isResolved ? '#10b981' : 'var(--text-muted)',
                            padding: '0.25rem'
                          }}
                          title={isResolved ? "Marcar como pendiente" : "Marcar como resuelta"}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => handleStartEdit(note)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: '0.25rem'
                          }}
                          title="Editar nota"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: '0.25rem'
                          }}
                          title="Eliminar nota"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Título */}
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      margin: '0 0 0.5rem 0',
                      textDecoration: isResolved ? 'line-through' : 'none',
                      color: isResolved ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {note.title}
                    </h4>

                    {/* Contenido */}
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)', 
                      margin: 0, 
                      lineHeight: '1.5',
                      whiteSpace: 'pre-line' 
                    }}>
                      {note.content}
                    </p>
                  </div>

                  {/* Footer de la nota */}
                  <div style={{ 
                    marginTop: '1rem', 
                    paddingTop: '0.75rem', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>{new Date(note.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {isResolved && (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Resuelta</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: MIS TAREAS OPERATIVAS COMO RESPONSABLE */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} style={{ color: '#10b981' }} />
            Mis Tareas Operativas en el Equipo
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Tareas de los proyectos donde Mateo participa individualmente o en conjunto con el equipo.
          </p>
        </div>

        {mateoTasks.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No tienes tareas asignadas actualmente.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {mateoTasks.map(task => {
              const proj = projects.find(p => p.id === task.project_id);
              const isDone = task.status === 'done';

              return (
                <div 
                  key={task.id} 
                  className="card"
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    borderLeft: isDone ? '4px solid #10b981' : '4px solid var(--accent-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {proj ? proj.name : 'Proyecto'}
                      </span>
                      <span className={`status-pill ${isDone ? 'approved' : 'pending'}`} style={{ fontSize: '0.68rem' }}>
                        {isDone ? 'Completada' : task.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                      </span>
                    </div>

                    <h4 style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      margin: '0 0 0.4rem 0',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {task.title}
                    </h4>

                    {task.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={13} />
                      <span>{task.assigned_to}</span>
                    </div>
                    {task.due_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} />
                        <span>{task.due_date}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
