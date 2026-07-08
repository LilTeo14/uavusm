import React, { useState } from 'react';
import { 
  Plus, ClipboardList, Package, Upload, FileText, Trash2, Edit2, 
  Calendar, User, Check, ArrowRight, Download, ExternalLink, RefreshCw,
  Lock, Unlock, ShieldAlert, AlertTriangle, Link
} from 'lucide-react';
import { dbService } from '../services/db';

export default function ProjectDetails({ 
  project, 
  materials, 
  tasks, 
  notes = [],
  onRefresh, 
  isAdmin,
  setIsAdmin 
}) {
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'tasks' | 'notes'
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Estados de los Formularios
  const [materialForm, setMaterialForm] = useState({ name: '', quantity: 1, unit_price: '', requested_by: '' });
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '', due_date: '', status: 'todo' });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [selectedViewNote, setSelectedViewNote] = useState(null);

  // PIN & Project Edit States
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ budget: '', leader_name: '', leader_email: '', status: 'Por iniciar', due_date: '' });

  // Link States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [editingLinkMaterialId, setEditingLinkMaterialId] = useState(null);

  // --- CÁLCULO DE MÉTRICAS ESPECÍFICAS DEL PROYECTO ---
  const projectMaterials = materials.filter(m => m.project_id === project.id);
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  const projectNotes = notes.filter(n => n.project_id === project.id);

  const totalSpent = projectMaterials
    .filter(m => m.status === 'approved' || m.status === 'purchased')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  const totalPending = projectMaterials
    .filter(m => m.status === 'pending')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  const budgetPercent = Math.min(Math.round((totalSpent / Number(project.budget)) * 100), 100);

  // Tareas por estado
  const todoTasks = projectTasks.filter(t => t.status === 'todo');
  const inProgressTasks = projectTasks.filter(t => t.status === 'in_progress');
  const doneTasks = projectTasks.filter(t => t.status === 'done');

  // --- ACCIONES DE ARCHIVOS ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await dbService.uploadFile(file, 'images');
      await dbService.updateProject(project.id, { image_url: url });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Error al subir la imagen: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingDoc(true);
      const url = await dbService.uploadFile(file, 'docs');
      await dbService.updateProject(project.id, { doc_url: url });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Error al subir el documento: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRemoveDoc = async () => {
    if (window.confirm('¿Seguro que deseas eliminar el documento explicativo de este proyecto?')) {
      try {
        await dbService.updateProject(project.id, { doc_url: null });
        onRefresh();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  // --- ACCIONES DE MATERIALES ---
  const openNewMaterialModal = () => {
    setMaterialForm({ name: '', quantity: 1, unit_price: '', requested_by: '' });
    setEditingMaterialId(null);
    setIsMaterialModalOpen(true);
  };

  const openEditMaterialModal = (material) => {
    setMaterialForm({
      name: material.name,
      quantity: material.quantity,
      unit_price: material.unit_price,
      requested_by: material.requested_by
    });
    setEditingMaterialId(material.id);
    setIsMaterialModalOpen(true);
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!materialForm.name || !materialForm.unit_price || !materialForm.requested_by) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      if (editingMaterialId) {
        // En una actualización, reiniciamos a 'pending' para que vuelva a requerir aprobación si cambian precios/cantidades
        await dbService.updateMaterial(editingMaterialId, {
          ...materialForm,
          status: 'pending' // Al editar, se vuelve a solicitar aprobación
        });
      } else {
        await dbService.createMaterial({
          project_id: project.id,
          ...materialForm,
          status: 'pending'
        });
      }
      setIsMaterialModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error al guardar material: ' + err.message);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este requerimiento de material?')) {
      try {
        await dbService.deleteMaterial(id);
        onRefresh();
      } catch (err) {
        alert('Error al eliminar material: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (materialId, newStatus) => {
    if (newStatus === 'approved' && !isAdmin) {
      setPendingAction({ type: 'status_change', id: materialId, value: newStatus });
      setPinInput('');
      setPinError('');
      setIsPinModalOpen(true);
    } else {
      try {
        await dbService.updateMaterial(materialId, {
          status: newStatus,
          purchase_status: newStatus === 'approved' ? 'por_comprar' : null
        });
        onRefresh();
      } catch (err) {
        alert('Error al cambiar el estado del material: ' + err.message);
      }
    }
  };

  const handlePurchaseStatusChange = async (materialId, newPurchaseStatus) => {
    try {
      await dbService.updateMaterial(materialId, { purchase_status: newPurchaseStatus });
      onRefresh();
    } catch (err) {
      alert('Error al cambiar el estado del pedido: ' + err.message);
    }
  };

  const openEditProject = () => {
    setProjectForm({
      budget: project.budget,
      leader_name: project.leader_name || '',
      leader_email: project.leader_email || '',
      status: project.status || 'Por iniciar',
      due_date: project.due_date || ''
    });
    if (!isAdmin) {
      setPendingAction({ type: 'edit_project' });
      setPinInput('');
      setPinError('');
      setIsPinModalOpen(true);
    } else {
      setIsEditProjectModalOpen(true);
    }
  };

  const handleProjectEditSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.budget || !projectForm.leader_name) {
      alert('El presupuesto y líder son requeridos.');
      return;
    }
    try {
      await dbService.updateProject(project.id, {
        budget: Number(projectForm.budget),
        leader_name: projectForm.leader_name,
        leader_email: projectForm.leader_email,
        status: projectForm.status,
        due_date: projectForm.due_date || null
      });
      setIsEditProjectModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error al actualizar el proyecto: ' + err.message);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (dbService.verifyAdminPin(pinInput)) {
      setIsAdmin(true);
      setIsPinModalOpen(false);
      
      if (pendingAction) {
        if (pendingAction.type === 'status_change') {
          try {
            await dbService.updateMaterial(pendingAction.id, {
              status: pendingAction.value,
              purchase_status: pendingAction.value === 'approved' ? 'por_comprar' : null
            });
            onRefresh();
          } catch (err) {
            alert('Error al aprobar material: ' + err.message);
          }
        } else if (pendingAction.type === 'edit_project') {
          setIsEditProjectModalOpen(true);
        }
        setPendingAction(null);
      }
    } else {
      setPinError('PIN incorrecto. Por favor, intenta de nuevo.');
    }
  };

  const openLinkModal = (material) => {
    setEditingLinkMaterialId(material.id);
    setLinkInput(material.link || '');
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await dbService.updateMaterial(editingLinkMaterialId, { link: linkInput || null });
      setIsLinkModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error al guardar el enlace: ' + err.message);
    }
  };

  // --- ACCIONES DE TAREAS ---
  const openNewTaskModal = (status = 'todo') => {
    setTaskForm({ title: '', description: '', assigned_to: '', due_date: '', status });
    setEditingTaskId(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
      status: task.status
    });
    setEditingTaskId(task.id);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title) {
      alert('La tarea debe tener un título');
      return;
    }

    try {
      if (editingTaskId) {
        await dbService.updateTask(editingTaskId, taskForm);
      } else {
        await dbService.createTask({
          project_id: project.id,
          ...taskForm
        });
      }
      setIsTaskModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error al guardar tarea: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      try {
        await dbService.deleteTask(id);
        onRefresh();
      } catch (err) {
        alert('Error al eliminar tarea: ' + err.message);
      }
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await dbService.updateTask(taskId, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert('Error al mover tarea: ' + err.message);
    }
  };

  // --- ACCIONES DE NOTAS ---
  const openNewNoteModal = () => {
    setNoteForm({ title: '', content: '' });
    setEditingNoteId(null);
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (e, note) => {
    e.stopPropagation();
    setNoteForm({
      title: note.title,
      content: note.content
    });
    setEditingNoteId(note.id);
    setIsNoteModalOpen(true);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.content) {
      alert('La nota debe tener un título y contenido');
      return;
    }

    try {
      if (editingNoteId) {
        await dbService.updateNote(editingNoteId, noteForm);
      } else {
        await dbService.createNote({
          project_id: project.id,
          ...noteForm
        });
      }
      setIsNoteModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error al guardar nota: ' + err.message);
    }
  };

  const handleDeleteNote = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('¿Seguro que deseas eliminar esta nota?')) {
      try {
        await dbService.deleteNote(id);
        onRefresh();
        if (selectedViewNote && selectedViewNote.id === id) {
          setSelectedViewNote(null);
        }
      } catch (err) {
        alert('Error al eliminar nota: ' + err.message);
      }
    }
  };

  const getPurchaseStatusStyle = (status) => {
    if (status === 'disponible') {
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--state-approved)'
      };
    }
    if (status === 'pedido') {
      return {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: 'var(--state-pending)'
      };
    }
    return {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--state-danger)'
    };
  };

  const leaderInitials = project.leader_name
    ? project.leader_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="project-details">
      {/* Encabezado del Proyecto */}
      <div className="project-detail-header">
        {/* Imagen de Referencia o Uploader */}
        <label 
          className="project-detail-image-uploader"
          style={project.image_url ? { backgroundImage: `url(${project.image_url})`, border: 'none' } : {}}
        >
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage ? (
            <div className="image-uploader-overlay" style={{ opacity: 1 }}>
              <RefreshCw className="pulse-dot" size={24} />
              <span>Subiendo...</span>
            </div>
          ) : (
            <div className="image-uploader-overlay">
              <Upload size={24} />
              <span>Subir imagen de referencia</span>
            </div>
          )}
          {!project.image_url && !uploadingImage && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Upload size={32} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.8rem' }}>Subir Imagen de Referencia</span>
            </div>
          )}
        </label>

        {/* Información del Proyecto */}
        <div className="project-detail-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 className="project-detail-title" style={{ margin: 0 }}>{project.name}</h1>
            <button 
              onClick={openEditProject} 
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', borderRadius: '6px' }}
            >
              <Edit2 size={12} /> Editar Proyecto
            </button>
          </div>
          <p className="project-detail-desc" style={{ marginTop: '0.5rem' }}>{project.description}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.8rem', alignItems: 'center' }}>
            <div className="project-detail-leader">
              <span className="leader-avatar">{leaderInitials}</span>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1 }}>Líder de Proyecto</p>
                <p style={{ fontWeight: 600 }}>{project.leader_name} ({project.leader_email})</p>
              </div>
            </div>

            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }}></div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.25rem' }}>Estado</p>
              <span className={`status-pill`} style={{ 
                backgroundColor: project.status === 'Por iniciar' ? 'rgba(148, 163, 184, 0.1)' : project.status === 'En progreso' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: project.status === 'Por iniciar' ? 'var(--text-secondary)' : project.status === 'En progreso' ? 'var(--accent-primary)' : 'var(--state-approved)'
              }}>
                {project.status || 'Por iniciar'}
              </span>
            </div>

            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }}></div>

            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.25rem' }}>Plazo de Entrega</p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                {project.due_date ? new Date(project.due_date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin plazo'}
              </p>
            </div>
          </div>

          {/* Estado de Presupuesto */}
          <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ejecución Presupuestaria</span>
              <span style={{ fontWeight: 700 }}>
                {budgetPercent}% (Gastado/Aprobado: CLP {totalSpent.toLocaleString('en-US')} de CLP {Number(project.budget).toLocaleString('en-US')})
              </span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${budgetPercent}%`,
                  backgroundColor: budgetPercent > 90 ? 'var(--state-danger)' : budgetPercent > 70 ? 'var(--state-pending)' : 'var(--state-approved)'
                }}
              ></div>
            </div>
            {totalPending > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--state-pending)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                * Hay CLP {totalPending.toLocaleString('en-US')} adicionales en solicitudes de materiales pendientes de revisión.
              </p>
            )}
          </div>

          {/* Documento explicativo */}
          {project.doc_url ? (
            <div className="project-doc-box">
              <div className="doc-info">
                <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Documento Explicativo del Proyecto</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cargado en almacenamiento persistente</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href={project.doc_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Ver <ExternalLink size={12} />
                </a>
                <button onClick={handleRemoveDoc} className="btn btn-danger btn-sm btn-icon">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ) : (
            <label className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginTop: '1rem', cursor: 'pointer', display: 'inline-flex' }}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.txt" 
                style={{ display: 'none' }} 
                onChange={handleDocUpload}
                disabled={uploadingDoc}
              />
              <Upload size={14} style={{ marginRight: '0.4rem' }} />
              {uploadingDoc ? 'Subiendo documento...' : 'Subir Documento Explicativo (PDF/Word)'}
            </label>
          )}
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} /> Lista de Materiales ({projectMaterials.length})
          </span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={16} /> Tablero de Tareas ({projectTasks.length})
          </span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} /> Notas ({projectNotes.length})
          </span>
        </button>
      </div>

      {/* Pestaña: Materiales */}
      {activeTab === 'materials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Solicitud de Componentes y Materiales</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cualquier estudiante puede solicitar materiales. La aprobación final requiere PIN de Administrador.</p>
            </div>
            <button onClick={openNewMaterialModal} className="btn btn-primary">
              <Plus size={16} /> Solicitar Material
            </button>
          </div>

          <div className="table-container">
            {projectMaterials.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre de Material / Componente</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                    <th>Solicitado Por</th>
                    <th>Aprobación</th>
                    <th>Estado de Pedido</th>
                    <th>Enlace</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projectMaterials.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.quantity}</td>
                      <td>CLP {Number(m.unit_price).toLocaleString('en-US')}</td>
                      <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        CLP {(Number(m.unit_price) * Number(m.quantity)).toLocaleString('en-US')}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{m.requested_by}</td>
                      <td>
                        <select
                          value={m.status}
                          onChange={(e) => handleStatusChange(m.id, e.target.value)}
                          className={`status-select status-pill ${m.status}`}
                          style={{
                            backgroundColor: m.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : m.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: m.status === 'pending' ? 'var(--state-pending)' : m.status === 'approved' ? 'var(--state-approved)' : 'var(--state-danger)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pendiente</option>
                          <option value="approved" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Aprobado</option>
                          <option value="rejected" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Rechazado</option>
                        </select>
                      </td>
                      <td>
                        {m.status === 'approved' ? (
                          <select
                            value={m.purchase_status || 'por_comprar'}
                            onChange={(e) => handlePurchaseStatusChange(m.id, e.target.value)}
                            style={{
                              ...getPurchaseStatusStyle(m.purchase_status || 'por_comprar'),
                              border: '1px solid var(--border-color)',
                              fontSize: '0.8rem',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="por_comprar" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--state-danger)' }}>Por comprar</option>
                            <option value="pedido" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--state-pending)' }}>Pedido</option>
                            <option value="disponible" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--state-approved)' }}>Disponible</option>
                          </select>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {m.link ? (
                            <>
                              <button 
                                onClick={() => openLinkModal(m)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', height: '28px' }}
                                title="Ver o editar enlace"
                              >
                                <Link size={12} /> Link
                              </button>
                              <a 
                                href={m.link.startsWith('http') ? m.link : `https://${m.link}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-secondary btn-sm btn-icon"
                                style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Ir al enlace"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </>
                          ) : (
                            <button 
                              onClick={() => openLinkModal(m)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', borderStyle: 'dashed', height: '28px' }}
                            >
                              <Plus size={12} /> Agregar
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openEditMaterialModal(m)}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Editar solicitud"
                            disabled={m.purchase_status === 'pedido' || m.purchase_status === 'disponible'}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="btn btn-danger btn-sm btn-icon"
                            title="Eliminar solicitud"
                            disabled={m.purchase_status === 'pedido' || m.purchase_status === 'disponible'}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Package size={40} style={{ margin: '0.5rem auto 1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>No hay requerimientos de materiales para este proyecto.</p>
                <p style={{ fontSize: '0.8rem' }}>Haz clic en "Solicitar Material" para agregar uno nuevo.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pestaña: Tareas (Tablero Kanban) */}
      {activeTab === 'tasks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Tablero de Control de Tareas</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Asigna responsabilidades y fechas de entrega para mantener el ritmo del equipo.</p>
            </div>
            <button onClick={() => openNewTaskModal('todo')} className="btn btn-primary">
              <Plus size={16} /> Crear Tarea
            </button>
          </div>

          <div className="kanban-board">
            {/* Columna: Por Hacer */}
            <div className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: 'var(--text-secondary)' }}>
                  Por Hacer
                </span>
                <span className="kanban-card-count">{todoTasks.length}</span>
              </div>
              <div className="kanban-cards-container">
                {todoTasks.map(t => renderTaskCard(t))}
                {todoTasks.length === 0 && <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin tareas</div>}
              </div>
            </div>

            {/* Columna: En Progreso */}
            <div className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: 'var(--accent-primary)' }}>
                  En Progreso
                </span>
                <span className="kanban-card-count">{inProgressTasks.length}</span>
              </div>
              <div className="kanban-cards-container">
                {inProgressTasks.map(t => renderTaskCard(t))}
                {inProgressTasks.length === 0 && <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin tareas</div>}
              </div>
            </div>

            {/* Columna: Completado */}
            <div className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: 'var(--state-approved)' }}>
                  Completadas
                </span>
                <span className="kanban-card-count">{doneTasks.length}</span>
              </div>
              <div className="kanban-cards-container">
                {doneTasks.map(t => renderTaskCard(t))}
                {doneTasks.length === 0 && <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin tareas</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Notas */}
      {activeTab === 'notes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Notas y Documentos de Trabajo</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registra notas técnicas, ideas o análisis del equipo para este proyecto.</p>
            </div>
            <button onClick={openNewNoteModal} className="btn btn-primary">
              <Plus size={16} /> Agregar Nota
            </button>
          </div>

          <div className="notes-grid">
            {projectNotes.map(note => {
              // Limpiar marcas markdown básicas del snippet
              const cleanText = note.content.replace(/[#\*`_\-|>]/g, '').trim().substring(0, 180);
              const snippet = cleanText.length >= 180 ? `${cleanText}...` : cleanText;
              
              const noteDate = note.created_at
                ? new Date(note.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Sin fecha';

              return (
                <div 
                  className="note-card" 
                  key={note.id} 
                  onClick={() => setSelectedViewNote(note)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <h3 className="note-card-title">{note.title}</h3>
                    <p className="note-card-snippet">{snippet}</p>
                  </div>
                  <div className="note-card-footer">
                    <span>{noteDate}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={(e) => openEditNoteModal(e, note)} 
                        className="btn btn-secondary btn-icon"
                        style={{ width: '26px', height: '26px', padding: 0 }}
                        title="Editar nota"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteNote(e, note.id)} 
                        className="btn btn-danger btn-icon"
                        style={{ width: '26px', height: '26px', padding: 0 }}
                        title="Eliminar nota"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {projectNotes.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={40} style={{ margin: '0.5rem auto 1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>No hay notas guardadas para este proyecto.</p>
                <p style={{ fontSize: '0.8rem' }}>Haz clic en "Agregar Nota" para registrar la primera.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: SOLICITUD DE MATERIAL
         ==================================================================== */}
      {isMaterialModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingMaterialId ? 'Editar Solicitud' : 'Solicitar Material o Componente'}</h3>
              <button className="modal-close-btn" onClick={() => setIsMaterialModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleMaterialSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre del Componente / Material *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej: Motores Brushless 2200KV, Planchas de Balsa..."
                    value={materialForm.name}
                    onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })}
                    required 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Cantidad *</label>
                    <input 
                      type="number" 
                      min="1"
                      className="form-input" 
                      value={materialForm.quantity}
                      onChange={e => setMaterialForm({ ...materialForm, quantity: parseInt(e.target.value) || 1 })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio Unitario (USD) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      className="form-input" 
                      placeholder="Ej: 15.50"
                      value={materialForm.unit_price}
                      onChange={e => setMaterialForm({ ...materialForm, unit_price: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tu Nombre (Solicitante) *</label>
                  <select 
                    className="form-select" 
                    value={materialForm.requested_by}
                    onChange={e => setMaterialForm({ ...materialForm, requested_by: e.target.value })}
                    required
                  >
                    <option value="" disabled>Selecciona tu nombre</option>
                    <option value="Renato.R">Renato.R</option>
                    <option value="Tomas.H">Tomas.H</option>
                    <option value="Paolo.L">Paolo.L</option>
                    <option value="Rodrigo.C">Rodrigo.C</option>
                    <option value="Ignacio.S">Ignacio.S</option>
                    <option value="Gabriel.Z">Gabriel.Z</option>
                    <option value="Pablo.G">Pablo.G</option>
                    <option value="Lissete.H">Lissete.H</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMaterialModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingMaterialId ? 'Guardar Cambios' : 'Enviar Solicitud'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: CREACIÓN / EDICIÓN DE TAREA
         ==================================================================== */}
      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingTaskId ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h3>
              <button className="modal-close-btn" onClick={() => setIsTaskModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Título de la Tarea *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej: Calibración del compás, Compra de pegamento epoxi..."
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Descripción / Detalles</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Detalles sobre lo que se debe hacer..."
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Asignado A</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej: Carlos Díaz"
                      value={taskForm.assigned_to}
                      onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Entrega</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={taskForm.due_date}
                      onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Estado Inicial</label>
                  <select 
                    className="form-select"
                    value={taskForm.status}
                    onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="todo">Por Hacer</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="done">Completada</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingTaskId ? 'Actualizar' : 'Crear Tarea'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: CREACIÓN / EDICIÓN DE NOTA
         ==================================================================== */}
      {isNoteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingNoteId ? 'Editar Nota' : 'Agregar Nueva Nota'}</h3>
              <button className="modal-close-btn" onClick={() => setIsNoteModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleNoteSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Título de la Nota *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej: Especificaciones de fibra de vidrio, Ideas de diseño..."
                    value={noteForm.title}
                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Contenido de la Nota (Soporta Markdown) *</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Escribe tu nota aquí..."
                    rows={12}
                    value={noteForm.content}
                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                    style={{ fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNoteModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingNoteId ? 'Guardar Cambios' : 'Crear Nota'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: LECTURA DE NOTA DETALLADA
         ==================================================================== */}
      {selectedViewNote && (
        <div className="modal-overlay" onClick={() => setSelectedViewNote(null)}>
          <div className="modal-content note-view-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--accent-primary)' }}>{selectedViewNote.title}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedViewNote(null)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <MarkdownRenderer content={selectedViewNote.content} />
            </div>
            <div className="modal-footer">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Creado: {new Date(selectedViewNote.created_at).toLocaleString('es-CL')}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={(e) => {
                      openEditNoteModal(e, selectedViewNote);
                      setSelectedViewNote(null);
                    }}
                  >
                    Editar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setSelectedViewNote(null)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: VERIFICACIÓN DE PIN DE SEGURIDAD (ADMIN)
         ==================================================================== */}
      {isPinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div className="modal-header" style={{ justifyContent: 'center', borderBottom: 'none', paddingBottom: 0 }}>
              <div className="metric-icon-box" style={{ margin: '0 auto', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--state-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={24} />
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Verificación de PIN</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Ingresa el PIN de seguridad de 4 dígitos para realizar esta acción.
            </p>

            <form onSubmit={handlePinSubmit}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••"
                  maxLength={4}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2em', width: '100%' }}
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  autoFocus
                  required 
                />
                {pinError && <p style={{ color: 'var(--state-danger)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>{pinError}</p>}
              </div>
              
              <div style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '6px', backgroundColor: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.1)', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={12} style={{ color: '#ffc107', flexShrink: 0 }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  El PIN por defecto es <code>1234</code>.
                </span>
              </div>

              <div className="modal-footer" style={{ borderTop: 'none', padding: '1rem 0 0', display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setIsPinModalOpen(false); setPendingAction(null); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: EDICIÓN DE PROYECTO (PRESUPUESTO Y LÍDER)
         ==================================================================== */}
      {isEditProjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Modificar Proyecto: {project.name.split(':')[0]}</h3>
              <button className="modal-close-btn" onClick={() => setIsEditProjectModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleProjectEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Presupuesto Asignado (CLP) *</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-input" 
                    value={projectForm.budget}
                    onChange={e => setProjectForm({ ...projectForm, budget: e.target.value })}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Nombre del Líder de Proyecto *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={projectForm.leader_name}
                    onChange={e => setProjectForm({ ...projectForm, leader_name: e.target.value })}
                    required 
                  />
                </div>
                 
                <div className="form-group">
                  <label>Email del Líder *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={projectForm.leader_email}
                    onChange={e => setProjectForm({ ...projectForm, leader_email: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Estado del Proyecto *</label>
                  <select 
                    className="form-input"
                    value={projectForm.status}
                    onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}
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
                    value={projectForm.due_date}
                    onChange={e => setProjectForm({ ...projectForm, due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditProjectModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: EDITAR ENLACE DE COMPONENTE
         ==================================================================== */}
      {isLinkModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px', width: '100%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link size={18} style={{ color: 'var(--accent-primary)' }} /> Enlace del Componente
              </h3>
              <button className="modal-close-btn" onClick={() => setIsLinkModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleLinkSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>URL del Enlace</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://ejemplo.com/producto"
                    value={linkInput}
                    onChange={e => setLinkInput(e.target.value)}
                    autoFocus
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Introduce la URL del proveedor o cotización del componente.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLinkModalOpen(false)}>Cancelar</button>
                {linkInput && (
                  <a 
                    href={linkInput.startsWith('http') ? linkInput : `https://${linkInput}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                    style={{ marginRight: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Probar Enlace <ExternalLink size={12} />
                  </a>
                )}
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // --- RENDER DE TARJETA DE KANBAN ---
  function renderTaskCard(task) {
    const formattedDate = task.due_date 
      ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
      : null;

    return (
      <div className="kanban-card" key={task.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 className="kanban-card-title">{task.title}</h4>
          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '-0.2rem' }}>
            <button 
              onClick={() => openEditTaskModal(task)} 
              className="btn btn-secondary btn-icon" 
              style={{ width: '22px', height: '22px', padding: 0 }}
              title="Editar"
            >
              <Edit2 size={10} />
            </button>
            <button 
              onClick={() => handleDeleteTask(task.id)} 
              className="btn btn-danger btn-icon" 
              style={{ width: '22px', height: '22px', padding: 0 }}
              title="Eliminar"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
        {task.description && <p className="kanban-card-desc">{task.description}</p>}
        
        {/* Selector rápido de estado en la misma tarjeta */}
        <div style={{ marginBottom: '0.75rem' }}>
          <select 
            style={{ 
              width: '100%', 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              borderRadius: '4px',
              padding: '0.15rem 0.25rem',
              cursor: 'pointer'
            }}
            value={task.status}
            onChange={(e) => handleMoveTask(task.id, e.target.value)}
          >
            <option value="todo">Por Hacer</option>
            <option value="in_progress">En Progreso</option>
            <option value="done">Completada</option>
          </select>
        </div>

        <div className="kanban-card-footer">
          <span className="kanban-card-assignee">
            <User size={12} /> {task.assigned_to || 'Sin asignar'}
          </span>
          {formattedDate && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: isOverdue(task.due_date) && task.status !== 'done' ? 'var(--state-danger)' : 'var(--text-muted)' }}>
              <Calendar size={12} /> {formattedDate}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Comprobar si una tarea está atrasada
  function isOverdue(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(dateStr + 'T00:00:00');
    return dueDate < today;
  }

}

// ====================================================================
// RENDERIZADOR DE MARKDOWN PERSONALIZADO LIGERO
// ====================================================================
function MarkdownRenderer({ content }) {
  if (!content) return null;
  
  // Dividir el contenido por líneas en bloques por doble salto de línea
  const blocks = content.split(/\n\s*\n/);
  
  return (
    <div className="markdown-body">
      {blocks.map((block, index) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return null;

        // 1. Encabezados
        if (trimmedBlock.startsWith('# ')) {
          return <h1 key={index}>{renderInline(trimmedBlock.substring(2))}</h1>;
        }
        if (trimmedBlock.startsWith('## ')) {
          return <h2 key={index}>{renderInline(trimmedBlock.substring(3))}</h2>;
        }
        if (trimmedBlock.startsWith('### ')) {
          return <h3 key={index}>{renderInline(trimmedBlock.substring(4))}</h3>;
        }

        // 2. Línea horizontal
        if (trimmedBlock === '---') {
          return <hr key={index} style={{ margin: '1.5rem 0', border: 'none', borderBottom: '1px solid var(--border-color)' }} />;
        }

        // 3. Citas / Blockquotes
        if (trimmedBlock.startsWith('> ')) {
          const quoteContent = trimmedBlock.split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');
          return <blockquote key={index}>{renderInline(quoteContent)}</blockquote>;
        }

        // 4. Listas desordenadas
        if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ')) {
          const items = trimmedBlock.split('\n');
          return (
            <ul key={index}>
              {items.map((item, idx) => {
                const cleanedItem = item.replace(/^[\*\-]\s+/, '');
                return <li key={idx}>{renderInline(cleanedItem)}</li>;
              })}
            </ul>
          );
        }

        // 5. Listas ordenadas
        if (/^\d+\.\s+/.test(trimmedBlock)) {
          const items = trimmedBlock.split('\n');
          return (
            <ol key={index}>
              {items.map((item, idx) => {
                const cleanedItem = item.replace(/^\d+\.\s+/, '');
                return <li key={idx}>{renderInline(cleanedItem)}</li>;
              })}
            </ol>
          );
        }

        // 6. Tablas Markdown
        if (trimmedBlock.startsWith('|')) {
          const rows = trimmedBlock.split('\n');
          const hasAlignRow = rows.length > 1 && rows[1].includes(':---');
          const dataRows = hasAlignRow ? rows.slice(0, 1).concat(rows.slice(2)) : rows;
          const tableHeader = dataRows[0];
          const tableBody = dataRows.slice(1);

          const parseCells = (rowText) => {
            return rowText
              .split('|')
              .slice(1, -1)
              .map(c => c.trim());
          };

          const headers = parseCells(tableHeader);

          return (
            <div key={index} style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    {headers.map((h, idx) => (
                      <th key={idx} style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableBody.map((row, rIdx) => {
                    const cells = parseCells(row);
                    if (cells.length === 0 || (cells.length === 1 && cells[0] === '')) return null;
                    return (
                      <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: rIdx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                        {cells.map((c, cIdx) => (
                          <td key={cIdx} style={{ padding: '10px 14px', border: '1px solid var(--border-color)' }}>
                            {renderInline(c)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Por defecto: Párrafo
        const lines = trimmedBlock.split('\n');
        return (
          <p key={index} style={{ marginBottom: '1rem' }}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInline(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  if (!text) return '';
  
  const parts = [];
  let currentIdx = 0;
  
  const regex = /(\*\*|[\*_]|`)(.*?)\1/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIdx = match.index;
    const matchLength = match[0].length;
    const type = match[1];
    const matchText = match[2];
    
    if (matchIdx > currentIdx) {
      parts.push(text.substring(currentIdx, matchIdx));
    }
    
    if (type === '**') {
      parts.push(<strong key={matchIdx}>{matchText}</strong>);
    } else if (type === '*' || type === '_') {
      parts.push(<em key={matchIdx}>{matchText}</em>);
    } else if (type === '`') {
      parts.push(
        <code 
          key={matchIdx} 
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.08)', 
            padding: '2px 6px', 
            borderRadius: '4px', 
            fontFamily: 'monospace',
            fontSize: '0.85em',
            color: 'var(--accent-secondary)'
          }}
        >
          {matchText}
        </code>
      );
    }
    
    currentIdx = matchIdx + matchLength;
  }
  
  if (currentIdx < text.length) {
    parts.push(text.substring(currentIdx));
  }
  
  return parts.length > 0 ? parts : text;
}
