import React, { useState } from 'react';
import { dbService } from '../services/db';
import { 
  Lock, Unlock, CheckCircle, ShoppingBag, Edit, RefreshCw, 
  Trash2, DollarSign, UserCheck, AlertTriangle 
} from 'lucide-react';

export default function AdminConsole({ 
  projects, 
  materials, 
  onRefresh, 
  isAdmin, 
  setIsAdmin 
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [budgetForm, setBudgetForm] = useState({ budget: '', leader_name: '', leader_email: '', status: 'Por iniciar', due_date: '' });

  // --- CONTROL DE ACCESO ---
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (dbService.verifyAdminPin(pinInput)) {
      setIsAdmin(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('PIN incorrecto. Por favor, intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  // --- ACCIONES DE ADMINISTRACIÓN DE MATERIALES ---
  const handleApproveMaterial = async (id) => {
    try {
      await dbService.updateMaterial(id, { status: 'approved', purchase_status: 'por_comprar' });
      onRefresh();
    } catch (err) {
      alert('Error al aprobar: ' + err.message);
    }
  };

  const handleRejectMaterial = async (id) => {
    try {
      await dbService.updateMaterial(id, { status: 'rejected', purchase_status: null });
      onRefresh();
    } catch (err) {
      alert('Error al rechazar: ' + err.message);
    }
  };

  const handleUpdatePurchaseStatus = async (id, newPurchaseStatus) => {
    try {
      await dbService.updateMaterial(id, { purchase_status: newPurchaseStatus });
      onRefresh();
    } catch (err) {
      alert('Error al actualizar estado de pedido: ' + err.message);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar definitivamente esta solicitud de material?')) {
      try {
        await dbService.deleteMaterial(id);
        onRefresh();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  // --- EDICIÓN DE PROYECTO (PRESUPUESTO Y LÍDER) ---
  const startEditProject = (proj) => {
    setEditingProject(proj);
    setBudgetForm({
      budget: proj.budget,
      leader_name: proj.leader_name || '',
      leader_email: proj.leader_email || '',
      status: proj.status || 'Por iniciar',
      due_date: proj.due_date || ''
    });
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetForm.budget || !budgetForm.leader_name) {
      alert('El presupuesto y líder son requeridos.');
      return;
    }
    try {
      await dbService.updateProject(editingProject.id, {
        budget: Number(budgetForm.budget),
        leader_name: budgetForm.leader_name,
        leader_email: budgetForm.leader_email,
        status: budgetForm.status,
        due_date: budgetForm.due_date || null
      });
      setEditingProject(null);
      onRefresh();
    } catch (err) {
      alert('Error al actualizar proyecto: ' + err.message);
    }
  };

  // --- FILTROS DE MATERIALES GLOBALES ---
  const pendingMaterials = materials.filter(m => m.status === 'pending');
  const approvedMaterials = materials.filter(m => m.status === 'approved');

  // Si no es admin, mostrar pantalla de bloqueo
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div className="metric-icon-box" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px', borderRadius: '50%' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Consola de Administración</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Ingresa el PIN de seguridad para aprobar solicitudes de materiales y modificar los presupuestos de los proyectos.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label>PIN de Administrador</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••"
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.2em' }}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                autoFocus
                required 
              />
              {pinError && <p style={{ color: 'var(--state-danger)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>{pinError}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Desbloquear Consola
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.1)', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={14} style={{ color: '#ffc107', flexShrink: 0 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <strong>Nota:</strong> El PIN por defecto es <code>1234</code>. Puedes cambiarlo configurando la variable de entorno <code>VITE_ADMIN_PIN</code>.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Si es admin, mostrar consola
  return (
    <div className="admin-console">
      {/* Encabezado Admin */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Unlock size={22} style={{ color: 'var(--state-approved)' }} /> Consola de Administración Desbloqueada
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tienes permisos de lectura y escritura sobre presupuestos, líderes y aprobaciones.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          Cerrar Sesión Admin
        </button>
      </div>

      {/* Grid de Secciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* 1. SOLICITUDES PENDIENTES */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--state-pending)' }}>
            <UserCheck size={18} /> Solicitudes Pendientes de Aprobación ({pendingMaterials.length})
          </h3>
          <div className="table-container">
            {pendingMaterials.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                    <th>Solicitado por</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMaterials.map(m => {
                    const proj = projects.find(p => p.id === m.project_id);
                    return (
                      <tr key={m.id}>
                        <td style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {proj ? proj.name.split(':')[0] : 'Proyecto Desconocido'}
                        </td>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td>{m.quantity}</td>
                        <td>CLP {Number(m.unit_price).toLocaleString('en-US')}</td>
                        <td style={{ fontWeight: 700 }}>CLP {(Number(m.unit_price) * Number(m.quantity)).toLocaleString('en-US')}</td>
                        <td>{m.requested_by}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleApproveMaterial(m.id)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.35rem 0.6rem', backgroundColor: 'var(--state-approved)' }}
                            >
                              <CheckCircle size={12} /> Aprobar
                            </button>
                            <button 
                              onClick={() => handleRejectMaterial(m.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.6rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              Rechazar
                            </button>
                            <button 
                              onClick={() => handleDeleteMaterial(m.id)}
                              className="btn btn-danger btn-sm btn-icon"
                              title="Eliminar"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5, color: 'var(--state-approved)' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>¡Al día! No hay solicitudes pendientes de revisión.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. MATERIALES APROBADOS (GESTIÓN DE COMPRAS) */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <ShoppingBag size={18} /> Gestión de Compras y Pedidos de Materiales Aprobados ({approvedMaterials.length})
          </h3>
          <div className="table-container">
            {approvedMaterials.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                    <th>Solicitado por</th>
                    <th>Estado de Pedido</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedMaterials.map(m => {
                    const proj = projects.find(p => p.id === m.project_id);
                    return (
                      <tr key={m.id}>
                        <td style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {proj ? proj.name.split(':')[0] : 'Proyecto Desconocido'}
                        </td>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td>{m.quantity}</td>
                        <td>CLP {Number(m.unit_price).toLocaleString('en-US')}</td>
                        <td style={{ fontWeight: 700 }}>CLP {(Number(m.unit_price) * Number(m.quantity)).toLocaleString('en-US')}</td>
                        <td>{m.requested_by}</td>
                        <td>
                          <select 
                            style={{ 
                              backgroundColor: 'var(--bg-tertiary)', 
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.8rem',
                              borderRadius: '4px',
                              padding: '0.35rem 0.6rem',
                              cursor: 'pointer'
                            }}
                            value={m.purchase_status || 'por_comprar'}
                            onChange={(e) => handleUpdatePurchaseStatus(m.id, e.target.value)}
                          >
                            <option value="por_comprar">Por comprar</option>
                            <option value="pedido">Pedido</option>
                            <option value="disponible">Disponible</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="btn btn-danger btn-sm btn-icon"
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No hay materiales aprobados pendientes de compra.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. CONTROL DE PRESUPUESTOS Y LÍDERES DE PROYECTOS */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} style={{ color: 'var(--accent-secondary)' }} /> Gestión de Presupuestos y Liderazgo de Proyectos
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {projects.map(proj => {
              const projectMaterials = materials.filter(m => m.project_id === proj.id);
              const approved = projectMaterials
                .filter(m => m.status === 'approved' || m.status === 'purchased')
                .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
              const spent = projectMaterials
                .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
                .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

              return (
                <div className="card" key={proj.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    {proj.name.split(':')[0]}
                  </h4>
                  <div style={{ fontSize: '0.85rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <strong>Líder:</strong> {proj.leader_name || 'Sin asignar'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <strong>Email:</strong> {proj.leader_email || 'Sin asignar'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      <strong>Presupuesto total:</strong> CLP {Number(proj.budget).toLocaleString('en-US')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <strong>Total Aprobado:</strong> CLP {approved.toLocaleString('en-US')}
                    </p>
                    <p style={{ color: spent > Number(proj.budget) ? 'var(--state-danger)' : 'var(--state-approved)', fontWeight: 600 }}>
                      <strong>Total Gastado:</strong> CLP {spent.toLocaleString('en-US')}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <strong>Disponible:</strong> CLP {(Number(proj.budget) - spent).toLocaleString('en-US')}
                    </p>
                  </div>
                  <button 
                    onClick={() => startEditProject(proj)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}
                  >
                    <Edit size={12} /> Modificar Líder / Presupuesto
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ====================================================================
         MODAL: EDICIÓN DE PROYECTO (PRESUPUESTO Y LÍDER)
         ==================================================================== */}
      {editingProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Modificar Proyecto: {editingProject.name.split(':')[0]}</h3>
              <button className="modal-close-btn" onClick={() => setEditingProject(null)}>×</button>
            </div>
            <form onSubmit={handleBudgetSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Presupuesto Asignado (CLP) *</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-input" 
                    value={budgetForm.budget}
                    onChange={e => setBudgetForm({ ...budgetForm, budget: e.target.value })}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Nombre del Líder de Proyecto *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={budgetForm.leader_name}
                    onChange={e => setBudgetForm({ ...budgetForm, leader_name: e.target.value })}
                    required 
                  />
                </div>
 
                <div className="form-group">
                  <label>Email del Líder *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={budgetForm.leader_email}
                    onChange={e => setBudgetForm({ ...budgetForm, leader_email: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Estado del Proyecto *</label>
                  <select 
                    className="form-input"
                    value={budgetForm.status}
                    onChange={e => setBudgetForm({ ...budgetForm, status: e.target.value })}
                    required
                  >
                    <option value="Por iniciar">Por iniciar</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Plazo / Fecha Límite</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={budgetForm.due_date}
                    onChange={e => setBudgetForm({ ...budgetForm, due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProject(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
