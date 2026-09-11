import React, { useState, useEffect } from 'react';
import { dbService, getProjectPhase } from '../services/db';
import { 
  TEAM_MEMBERS, 
  getAllTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from '../services/team';
import { 
  Lock, Unlock, CheckCircle, ShoppingBag, Edit, RefreshCw, 
  Trash2, DollarSign, UserCheck, AlertTriangle, Zap, Trophy,
  KeyRound, RotateCcw, ShieldCheck, UserCog, Sparkles, UserPlus,
  Users, Mail, Award, X, Check, Eye
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
  const [userPasswords, setUserPasswords] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users'
  const [teamList, setTeamList] = useState(() => getAllTeamMembers());
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    id: '',
    name: '',
    fullName: '',
    role: '',
    email: '',
    avatar: '👤',
    color: '#0ea5e9'
  });

  const refreshTeamAndPasswords = () => {
    setTeamList(getAllTeamMembers());
    setUserPasswords(dbService.getAllUsersPasswordStatus());
  };

  const refreshPasswordStatus = () => {
    refreshTeamAndPasswords();
  };

  useEffect(() => {
    if (isAdmin) {
      refreshTeamAndPasswords();
    }
  }, [isAdmin]);

  // --- CONTROL DE ACCESO ---
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const isValid = await dbService.verifyAdminCredentials(pinInput);
    if (isValid) {
      setIsAdmin(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Contraseña o PIN incorrecto. Por favor, intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  // --- GESTIÓN DE CONTRASEÑAS DE USUARIOS ---
  const handleResetPassword = async (member) => {
    const isSelf = member.id === 'mateo';
    const message = isSelf
      ? '¿Seguro que deseas restablecer tu propia contraseña de Administrador (Mateo)? Quedarás sin contraseña y en tu próximo ingreso se te solicitará crear una nueva clave.'
      : `¿Seguro que deseas restablecer y dejar sin contraseña a ${member.name}? La próxima vez que ingrese a la plataforma se le solicitará crear su contraseña por primera vez.`;

    if (window.confirm(message)) {
      try {
        await dbService.removeUserPassword(member.id);
        refreshPasswordStatus();
        alert(`Se ha restablecido la contraseña de ${member.name}. Ahora está en estado "Sin Contraseña".`);
      } catch (err) {
        alert('Error al restablecer contraseña: ' + (err.message || err));
      }
    }
  };

  const handleSetPasswordManual = async (member) => {
    const newPass = window.prompt(`Ingresa una nueva contraseña para ${member.name} (mínimo 4 caracteres):`);
    if (newPass === null) return;
    if (newPass.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    try {
      await dbService.setUserPassword(member.id, newPass.trim());
      refreshPasswordStatus();
      alert(`Contraseña asignada exitosamente para ${member.name}.`);
    } catch (err) {
      alert('Error al asignar contraseña: ' + (err.message || err));
    }
  };

  // --- GESTIÓN DE PERFILES / USUARIOS (CRUD) ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      id: '',
      name: '',
      fullName: '',
      role: '',
      email: '',
      avatar: '👤',
      color: '#0ea5e9'
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (member) => {
    setEditingUser(member);
    setUserFormData({
      id: member.id,
      name: member.name || '',
      fullName: member.fullName || member.name || '',
      role: member.role || '',
      email: member.email || '',
      avatar: member.avatar || '👤',
      color: member.color || '#0ea5e9'
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userFormData.name.trim()) {
      alert('Por favor ingresa un nombre para el usuario.');
      return;
    }

    try {
      if (editingUser) {
        // Actualizar usuario existente
        updateTeamMember(editingUser.id, {
          name: userFormData.name.trim(),
          fullName: userFormData.fullName.trim() || userFormData.name.trim(),
          role: userFormData.role.trim() || 'Colaborador',
          email: userFormData.email.trim(),
          avatar: userFormData.avatar.trim() || '👤',
          color: userFormData.color
        });
        alert(`Usuario '${userFormData.name}' actualizado exitosamente.`);
      } else {
        // Crear nuevo usuario
        addTeamMember(userFormData);
        alert(`¡Nuevo usuario '${userFormData.name}' registrado exitosamente! Podrá crear su contraseña al ingresar.`);
      }
      setIsUserModalOpen(false);
      refreshTeamAndPasswords();
    } catch (err) {
      alert(err.message || 'Error al guardar usuario');
    }
  };

  const handleDeleteUser = async (member) => {
    if (member.id === 'mateo') {
      alert('No puedes eliminar al Administrador Principal (Mateo).');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${member.name} del equipo?`)) {
      try {
        deleteTeamMember(member.id);
        await dbService.removeUserPassword(member.id);
        refreshTeamAndPasswords();
        alert(`Usuario '${member.name}' eliminado.`);
      } catch (err) {
        alert(err.message || 'Error al eliminar usuario');
      }
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Unlock size={22} style={{ color: 'var(--state-approved)' }} /> Consola de Administración Desbloqueada
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tienes permisos de lectura y escritura sobre usuarios, accesos, presupuestos, líderes y aprobaciones.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          Cerrar Sesión Admin
        </button>
      </div>

      {/* Pestañas de Navegación de la Consola Admin */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1rem' }}
        >
          <ShoppingBag size={15} />
          <span>Materiales & Presupuestos</span>
          {pendingMaterials.length > 0 && (
            <span style={{ 
              backgroundColor: '#ef4444', 
              color: '#fff', 
              fontSize: '0.65rem', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '10px',
              fontWeight: 700 
            }}>
              {pendingMaterials.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1rem' }}
        >
          <Users size={15} />
          <span>Administración de Usuarios</span>
          <span style={{ 
            backgroundColor: activeTab === 'users' ? 'rgba(255,255,255,0.25)' : 'rgba(14,165,233,0.15)', 
            color: activeTab === 'users' ? '#fff' : 'var(--accent-primary)', 
            fontSize: '0.65rem', 
            padding: '0.1rem 0.45rem', 
            borderRadius: '10px',
            fontWeight: 700 
          }}>
            {teamList.length}
          </span>
        </button>
      </div>

      {/* VISTA 1: MATERIALES, COMPRAS Y PRESUPUESTOS */}
      {activeTab === 'overview' && (
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
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} style={{ color: 'var(--accent-secondary)' }} /> Gestión de Presupuestos y Liderazgo de Proyectos
          </h3>

          {/* Subsección: Etapa 2 (Proyectos Activos) */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
                Proyectos Activos (Etapa 2 - Versiones 2 & Avión 3D)
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Asigna y modifica los nuevos presupuestos, plazos y líderes designados para el ciclo de desarrollo en curso.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {projects.filter(p => getProjectPhase(p) === 'etapa_2').map(proj => {
                const projectMaterials = materials.filter(m => m.project_id === proj.id);
                const approved = projectMaterials
                  .filter(m => m.status === 'approved' || m.status === 'purchased')
                  .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
                const spent = projectMaterials
                  .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
                  .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

                return (
                  <div className="card" key={proj.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {proj.name}
                      </h4>
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        En Curso
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Líder:</strong> {proj.leader_name || 'Sin asignar'}
                      </p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Email:</strong> {proj.leader_email || 'Sin asignar'}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        <strong>Presupuesto:</strong> {Number(proj.budget) === 0 ? <span style={{ color: '#eab308', fontWeight: 600 }}>CLP 0 (Por reasignar)</span> : `CLP ${Number(proj.budget).toLocaleString('en-US')}`}
                      </p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Total Aprobado:</strong> CLP {approved.toLocaleString('en-US')}
                      </p>
                      <p style={{ color: spent > Number(proj.budget) ? 'var(--state-danger)' : 'var(--state-approved)', fontWeight: 600 }}>
                        <strong>Total Gastado:</strong> CLP {spent.toLocaleString('en-US')}
                      </p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Disponible:</strong> CLP {(Math.max(0, Number(proj.budget) - spent)).toLocaleString('en-US')}
                      </p>
                    </div>
                    <button 
                      onClick={() => startEditProject(proj)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}
                    >
                      <Edit size={12} /> Modificar Líder / Presupuesto
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsección: Etapa 1 (Proyectos Entregados / Histórico) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Trophy size={16} style={{ color: 'var(--state-approved)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--state-approved)' }}>
                Proyectos Entregados (Etapa 1 - Expo Seguridad)
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Balance histórico consolidado de los primeros prototipos presentados en Expo Seguridad.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', opacity: 0.9 }}>
              {projects.filter(p => getProjectPhase(p) === 'etapa_1').map(proj => {
                const projectMaterials = materials.filter(m => m.project_id === proj.id);
                const spent = projectMaterials
                  .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
                  .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

                return (
                  <div className="card" key={proj.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', margin: 0 }}>
                        {proj.name}
                      </h4>
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--state-approved)', fontWeight: 700 }}>
                        ✓ Entregado
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem' }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Líder:</strong> {proj.leader_name || 'Sin asignar'}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        <strong>Presupuesto cerrado:</strong> CLP {Number(proj.budget).toLocaleString('en-US')}
                      </p>
                      <p style={{ color: 'var(--state-approved)', fontWeight: 600 }}>
                        <strong>Total Gastado:</strong> CLP {spent.toLocaleString('en-US')}
                      </p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Remanente:</strong> CLP {(Number(proj.budget) - spent).toLocaleString('en-US')}
                      </p>
                    </div>
                    <button 
                      onClick={() => startEditProject(proj)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', fontSize: '0.75rem' }}
                    >
                      <Edit size={12} /> Ajustar Datos Históricos
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
      )}

      {/* VISTA 2: ADMINISTRACIÓN COMPLETA DE USUARIOS */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header de la Zona de Usuarios */}
          <div style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', 
            border: '1px solid var(--border-color, #243049)', 
            borderRadius: '14px', 
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-primary, #0ea5e9)' }}>
                <Users size={24} /> Directorio y Administración de Integrantes ({teamList.length})
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Crea nuevos miembros para el equipo, edita sus datos de perfil (roles, correos, avatares), gestiona sus contraseñas o déjalos sin clave para que la activen al ingresar.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                onClick={refreshTeamAndPasswords} 
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                title="Actualizar directorio"
              >
                <RefreshCw size={14} /> Refrescar
              </button>
              <button 
                onClick={handleOpenCreateUser} 
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1rem' }}
              >
                <UserPlus size={16} />
                <span>Registrar Nuevo Usuario</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Resumen Rápido */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{teamList.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Integrantes Totales</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {teamList.filter(m => userPasswords[m.id]?.hasPassword || dbService.hasUserPassword(m.id)).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Con Contraseña Activa</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
                <KeyRound size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {teamList.filter(m => !(userPasswords[m.id]?.hasPassword || dbService.hasUserPassword(m.id))).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Por Activar Contraseña</div>
              </div>
            </div>
          </div>

          {/* Tabla Completa de Administración de Usuarios */}
          <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol en el Equipo</th>
                  <th>Correo Institucional</th>
                  <th>Estado de Clave</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teamList.map(member => {
                  const hasPass = userPasswords[member.id]?.hasPassword || dbService.hasUserPassword(member.id);
                  const isMateoUser = member.id === 'mateo';

                  return (
                    <tr key={member.id} style={{ backgroundColor: isMateoUser ? 'rgba(14, 165, 233, 0.04)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ 
                            fontSize: '1.35rem',
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: member.bgBadge || 'rgba(255,255,255,0.06)',
                            border: `1px solid ${member.borderBadge || 'rgba(255,255,255,0.1)'}`
                          }}>
                            {member.avatar}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700, color: member.color || 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>{member.fullName || member.name}</span>
                              {isMateoUser && (
                                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: '8px', backgroundColor: 'rgba(14, 165, 233, 0.2)', color: 'var(--accent-primary)', fontWeight: 800 }}>
                                  Líder General
                                </span>
                              )}
                              {member.isCustom && (
                                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 600 }}>
                                  Nuevo
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              ID: <code>{member.id}</code>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600 }}>{member.role}</div>
                        {member.company && (
                          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Empresa: {member.company}</div>
                        )}
                      </td>

                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {member.email ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                            <span>{member.email}</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin correo</span>
                        )}
                      </td>

                      <td>
                        {hasPass ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <ShieldCheck size={13} /> Activa
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(234, 179, 8, 0.15)',
                            color: '#eab308',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <AlertTriangle size={13} /> Sin contraseña
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleOpenEditUser(member)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Editar datos del usuario"
                          >
                            <Edit size={12} />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleSetPasswordManual(member)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Asignar contraseña manualmente"
                          >
                            <KeyRound size={12} />
                            <span>{hasPass ? 'Clave' : 'Asignar'}</span>
                          </button>

                          {hasPass && (
                            <button
                              onClick={() => handleResetPassword(member)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '0.3rem 0.6rem',
                                color: '#f97316',
                                borderColor: 'rgba(249, 115, 22, 0.3)',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Dejar sin contraseña para que cree una al ingresar"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}

                          {!isMateoUser && (
                            <button
                              onClick={() => handleDeleteUser(member)}
                              className="btn btn-danger btn-sm btn-icon"
                              style={{ padding: '0.3rem 0.5rem' }}
                              title="Eliminar usuario"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: REGISTRAR O EDITAR INTEGRANTE DEL EQUIPO
         ==================================================================== */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCog size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>{editingUser ? `Editar Integrante: ${editingUser.name}` : 'Registrar Nuevo Integrante'}</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setIsUserModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Nombre Corto / Alias *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej: Carlos"
                      value={userFormData.name}
                      onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej: Carlos Pérez"
                      value={userFormData.fullName}
                      onChange={e => setUserFormData({ ...userFormData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Rol o Responsabilidad en UAVUSM *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej: Electrónica, Telemetría & Sensores"
                    value={userFormData.role}
                    onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Correo Electrónico (opcional)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="carlos@usm.cl"
                    value={userFormData.email}
                    onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Avatar / Emoji</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej: 👨‍🔧 o ⚡"
                      value={userFormData.avatar}
                      onChange={e => setUserFormData({ ...userFormData, avatar: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Color Distintivo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <input 
                        type="color" 
                        value={userFormData.color}
                        onChange={e => setUserFormData({ ...userFormData, color: e.target.value })}
                        style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{userFormData.color}</span>
                    </div>
                  </div>
                </div>

                {!editingUser && (
                  <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    💡 Al crear este usuario, podrá seleccionarse en el menú de perfiles superior y el sistema le pedirá crear su contraseña personal la primera vez que intente ingresar.
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsUserModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={14} />
                  <span>{editingUser ? 'Guardar Cambios' : 'Crear Integrante'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
