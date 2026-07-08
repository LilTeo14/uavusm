import React, { useState } from 'react';
import { 
  Plus, ClipboardList, Package, Upload, FileText, Trash2, Edit2, 
  Calendar, User, Check, ArrowRight, Download, ExternalLink, RefreshCw,
  Lock, Unlock, ShieldAlert, AlertTriangle, Link, Beaker, Save, Image
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
  const [uploadingNoteFile, setUploadingNoteFile] = useState(false);

  // Estados de los Formularios
  const [materialForm, setMaterialForm] = useState({ name: '', quantity: 1, unit_price: '', requested_by: '' });
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigned_to: '', due_date: '', status: 'todo' });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', file_url: '' });
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

  // --- ESTADOS Y ACCIONES PARA LA TABLA DE ENSAYOS ---
  const [trialsData, setTrialsData] = useState(null);
  const [trialsLoading, setTrialsLoading] = useState(true);
  const [isSavingTrials, setIsSavingTrials] = useState(false);
  const [selectedViewTrialRow, setSelectedViewTrialRow] = useState(null);

  const loadTrials = async () => {
    try {
      setTrialsLoading(true);
      const data = await dbService.getProjectTrials(project.id);
      if (data) {
        setTrialsData(data);
      } else {
        // Inicializar estructura por defecto si no existe
        const defaultData = {
          project_id: project.id,
          columns: ["Método", "Espesor / Capas", "Peso (g/m²)", "Resistencia Impacto", "Estado Visual", "Confirmado Por"],
          rows: ["Ensayo 1: Fibra + WBPU", "Ensayo 2: Papel Japón", "Ensayo 3: Masilla de Microesferas", "Ensayo 4: Doculam"],
          cells: {}
        };
        setTrialsData(defaultData);
      }
    } catch (err) {
      console.error("Error al cargar los ensayos:", err);
    } finally {
      setTrialsLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'trials') {
      loadTrials();
    }
  }, [activeTab, project.id]);

  const handleCellChange = (rowIdx, colIdx, val) => {
    setTrialsData(prev => {
      if (!prev) return prev;
      const key = `${rowIdx}_${colIdx}`;
      // No permitir editar si está confirmado y no es admin
      if (prev.cells[key]?.confirmed && !isAdmin) return prev;

      return {
        ...prev,
        cells: {
          ...prev.cells,
          [key]: {
            ...prev.cells[key],
            value: val
          }
        }
      };
    });
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingTrials(true);
      const saved = await dbService.saveProjectTrials(project.id, trialsData);
      setTrialsData(saved);
      alert('Progreso guardado correctamente (Borrador).');
    } catch (err) {
      alert('Error al guardar el borrador: ' + err.message);
    } finally {
      setIsSavingTrials(false);
    }
  };

  const isRowFilled = (rowIdx) => {
    if (!trialsData) return false;
    return trialsData.columns.every((_, colIdx) => {
      const cellVal = trialsData.cells[`${rowIdx}_${colIdx}`]?.value;
      return cellVal !== undefined && cellVal.trim() !== '';
    });
  };

  const handleConfirmRow = async (rowIdx) => {
    if (!isRowFilled(rowIdx)) {
      alert('Por favor, completa todos los campos de esta fila antes de confirmar.');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas confirmar esta fila? Una vez confirmada, no podrás borrar ni editar estos campos.`)) {
      return;
    }

    const updatedCells = { ...trialsData.cells };
    trialsData.columns.forEach((_, colIdx) => {
      const key = `${rowIdx}_${colIdx}`;
      if (updatedCells[key]) {
        updatedCells[key].confirmed = true;
      } else {
        updatedCells[key] = { value: '', confirmed: true };
      }
    });

    const updatedData = {
      ...trialsData,
      cells: updatedCells
    };

    try {
      setIsSavingTrials(true);
      const saved = await dbService.saveProjectTrials(project.id, updatedData);
      setTrialsData(saved);
      alert('Fila de ensayos confirmada y bloqueada con éxito.');
    } catch (err) {
      alert('Error al confirmar la fila: ' + err.message);
    } finally {
      setIsSavingTrials(false);
    }
  };

  const handleUnlockRow = async (rowIdx) => {
    if (!window.confirm(`¿Deseas desbloquear esta fila para permitir que los usuarios invitados editen sus campos de nuevo?`)) {
      return;
    }

    const updatedCells = { ...trialsData.cells };
    trialsData.columns.forEach((_, colIdx) => {
      const key = `${rowIdx}_${colIdx}`;
      if (updatedCells[key]) {
        updatedCells[key].confirmed = false;
      }
    });

    const updatedData = {
      ...trialsData,
      cells: updatedCells
    };

    try {
      setIsSavingTrials(true);
      const saved = await dbService.saveProjectTrials(project.id, updatedData);
      setTrialsData(saved);
      alert('Fila desbloqueada con éxito.');
    } catch (err) {
      alert('Error al desbloquear la fila: ' + err.message);
    } finally {
      setIsSavingTrials(false);
    }
  };

  const handleAddRow = () => {
    const rowName = prompt('Ingresa el nombre de la nueva fila (ej. Ensayo 5):');
    if (!rowName || rowName.trim() === '') return;

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedRows = [...prev.rows, rowName.trim()];
      const updatedData = { ...prev, rows: updatedRows };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  const handleAddColumn = () => {
    const colName = prompt('Ingresa el nombre de la nueva columna (ej. Temperatura):');
    if (!colName || colName.trim() === '') return;

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedCols = [...prev.columns, colName.trim()];
      const updatedData = { ...prev, columns: updatedCols };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  const handleRenameColumn = (colIdx) => {
    const oldName = trialsData.columns[colIdx];
    const newName = prompt(`Renombrar columna "${oldName}" a:`, oldName);
    if (newName === null || newName.trim() === '' || newName === oldName) return;

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedCols = [...prev.columns];
      updatedCols[colIdx] = newName.trim();
      const updatedData = { ...prev, columns: updatedCols };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  const handleRenameRow = (rowIdx) => {
    const oldName = trialsData.rows[rowIdx];
    const newName = prompt(`Renombrar fila "${oldName}" a:`, oldName);
    if (newName === null || newName.trim() === '' || newName === oldName) return;

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedRows = [...prev.rows];
      updatedRows[rowIdx] = newName.trim();
      const updatedData = { ...prev, rows: updatedRows };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  const handleDeleteColumn = (colIdx) => {
    const colName = trialsData.columns[colIdx];
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la columna "${colName}" y todos sus datos de celdas?`)) {
      return;
    }

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedCols = prev.columns.filter((_, idx) => idx !== colIdx);
      const updatedCells = {};
      Object.keys(prev.cells).forEach(key => {
        const [r, c] = key.split('_').map(Number);
        if (c < colIdx) {
          updatedCells[`${r}_${c}`] = prev.cells[key];
        } else if (c > colIdx) {
          updatedCells[`${r}_${c - 1}`] = prev.cells[key];
        }
      });

      const updatedData = { ...prev, columns: updatedCols, cells: updatedCells };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  const handleDeleteRow = (rowIdx) => {
    const rowName = trialsData.rows[rowIdx];
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la fila "${rowName}" y todos sus datos de celdas?`)) {
      return;
    }

    setTrialsData(prev => {
      if (!prev) return prev;
      const updatedRows = prev.rows.filter((_, idx) => idx !== rowIdx);
      const updatedCells = {};
      Object.keys(prev.cells).forEach(key => {
        const [r, c] = key.split('_').map(Number);
        if (r < rowIdx) {
          updatedCells[`${r}_${c}`] = prev.cells[key];
        } else if (r > rowIdx) {
          updatedCells[`${r - 1}_${c}`] = prev.cells[key];
        }
      });

      const updatedData = { ...prev, rows: updatedRows, cells: updatedCells };
      dbService.saveProjectTrials(project.id, updatedData)
        .then(saved => setTrialsData(saved))
        .catch(err => alert('Error al guardar: ' + err.message));
      return updatedData;
    });
  };

  // --- CÁLCULO DE MÉTRICAS ESPECÍFICAS DEL PROYECTO ---
  const projectMaterials = materials.filter(m => m.project_id === project.id);
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  const projectNotes = notes.filter(n => n.project_id === project.id);

  const totalApproved = projectMaterials
    .filter(m => m.status === 'approved' || m.status === 'purchased')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  const totalSpent = projectMaterials
    .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
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

  const handleNoteFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingNoteFile(true);
      const url = await dbService.uploadFile(file, 'notes');
      setNoteForm(prev => ({ ...prev, file_url: url }));
    } catch (err) {
      console.error(err);
      alert('Error al subir el archivo: ' + err.message);
    } finally {
      setUploadingNoteFile(false);
    }
  };

  const handleRemoveNoteFile = () => {
    setNoteForm(prev => ({ ...prev, file_url: '' }));
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

  const isImageFile = (url) => {
    if (!url) return false;
    if (url.startsWith('data:image/') || url.startsWith('blob:')) return true;
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  const handleDownloadNotePDF = (note) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes (popups) para descargar el PDF.');
      return;
    }
    
    const noteDate = note.created_at
      ? new Date(note.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Sin fecha';

    let attachmentHtml = '';
    if (note.file_url && isImageFile(note.file_url)) {
      attachmentHtml = `
        <div class="attachment">
          <h3>Imagen Adjunta:</h3>
          <div class="attachment-img-container">
            <img src="${note.file_url}" alt="Adjunto" />
          </div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 3rem;
              margin: 0;
              background-color: #ffffff;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #10b981;
              padding-bottom: 1.5rem;
              margin-bottom: 2rem;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .header-info {
              flex: 1;
            }
            .title {
              font-size: 2.25rem;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 0.5rem 0;
              line-height: 1.2;
            }
            .meta {
              font-size: 0.85rem;
              color: #64748b;
            }
            .project-badge {
              font-weight: 600;
              color: #10b981;
            }
            .content {
              font-size: 1.05rem;
              white-space: pre-wrap;
              word-break: break-word;
              color: #334155;
            }
            .attachment {
              margin-top: 3rem;
              border-top: 1px dashed #e2e8f0;
              padding-top: 2rem;
              page-break-inside: avoid;
            }
            .attachment h3 {
              font-size: 1.1rem;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 1rem;
            }
            .attachment-img-container {
              display: flex;
              justify-content: center;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 1.5rem;
            }
            .attachment img {
              max-width: 100%;
              max-height: 600px;
              object-fit: contain;
              border-radius: 4px;
            }
            @media print {
              body {
                padding: 0;
              }
              .container {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-info">
                <h1 class="title">${note.title}</h1>
                <div class="meta">
                  Proyecto: <span class="project-badge">${project.name}</span> &nbsp;|&nbsp; 
                  Creado: ${noteDate}
                </div>
              </div>
            </div>
            <div class="content">${note.content || ''}</div>
            ${attachmentHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- ACCIONES DE NOTAS ---
  const openNewNoteModal = () => {
    setNoteForm({ title: '', content: '', file_url: '' });
    setEditingNoteId(null);
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (e, note) => {
    e.stopPropagation();
    setNoteForm({
      title: note.title,
      content: note.content || '',
      file_url: note.file_url || ''
    });
    setEditingNoteId(note.id);
    setIsNoteModalOpen(true);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.title || (!noteForm.content && !noteForm.file_url)) {
      alert('La nota debe tener un título y contenido o un archivo adjunto');
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
              <span style={{ color: 'var(--text-secondary)' }}>Ejecución Presupuestaria (Gastado)</span>
              <span style={{ fontWeight: 700 }}>
                {budgetPercent}% (CLP {totalSpent.toLocaleString('en-US')} de CLP {Number(project.budget).toLocaleString('en-US')})
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              <span>Total Aprobado: CLP {totalApproved.toLocaleString('en-US')}</span>
              <span>Total Disponible: CLP {(Number(project.budget) - totalSpent).toLocaleString('en-US')}</span>
            </div>
            {totalPending > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--state-pending)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                * Hay CLP {totalPending.toLocaleString('en-US')} adicionales en solicitudes de materiales pendientes de revisión.
              </p>
            )}
          </div>

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
        {(project.id === 'd2222222-2222-2222-2222-222222222222' || project.name?.toLowerCase().includes('recubrimiento')) && (
          <button 
            className={`tab-btn ${activeTab === 'trials' ? 'active' : ''}`}
            onClick={() => setActiveTab('trials')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Beaker size={16} /> Ensayos
            </span>
          </button>
        )}
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
              const cleanText = (note.content || '').replace(/[#\*`_\-|>]/g, '').trim().substring(0, 180);
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
                    <h3 className="note-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ flex: 1 }}>{note.title}</span>
                      {note.file_url && (
                        isImageFile(note.file_url) ? (
                          <span style={{ flexShrink: 0, display: 'inline-flex', padding: '0.15rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', color: 'var(--state-approved)', fontSize: '0.65rem', fontWeight: 600, alignItems: 'center', gap: '0.2rem' }}>
                            <Image size={10} /> Imagen
                          </span>
                        ) : (
                          <span style={{ flexShrink: 0, display: 'inline-flex', padding: '0.15rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 600, alignItems: 'center', gap: '0.2rem' }}>
                            <FileText size={10} /> Adjunto
                          </span>
                        )
                      )}
                    </h3>
                    <p className="note-card-snippet">{snippet || (isImageFile(note.file_url) ? 'Ver imagen adjunta...' : 'Ver documento adjunto...')}</p>
                    {note.file_url && isImageFile(note.file_url) && (
                      <div style={{ marginTop: '0.75rem', width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img 
                          src={note.file_url} 
                          alt={note.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    )}
                  </div>
                  <div className="note-card-footer">
                    <span>{noteDate}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadNotePDF(note);
                        }} 
                        className="btn btn-secondary btn-icon"
                        style={{ width: '26px', height: '26px', padding: 0 }}
                        title="Descargar como PDF"
                      >
                        <Download size={12} />
                      </button>
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

      {/* Pestaña: Ensayos */}
      {activeTab === 'trials' && (project.id === 'd2222222-2222-2222-2222-222222222222' || project.name?.toLowerCase().includes('recubrimiento')) && (
        <div className="trials-tab-content" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Beaker size={20} style={{ color: 'var(--accent-primary)' }} />
                Registro y Control de Ensayos Técnicos
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Los invitados pueden registrar los resultados de las pruebas. Al confirmar y bloquear la fila, los datos quedan inmutables.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!isAdmin ? (
                <button 
                  type="button"
                  onClick={() => {
                    setPendingAction({ type: 'load_trials' });
                    setIsPinModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  <Lock size={14} /> Modo Estructura (Admin)
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="status-pill approved" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Unlock size={12} /> Estructura Editable (Admin)
                  </span>
                </div>
              )}
              
              <button 
                type="button"
                onClick={handleSaveDraft} 
                disabled={trialsLoading || isSavingTrials} 
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} /> Guardar Borrador
              </button>
            </div>
          </div>

          {trialsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <RefreshCw className="pulse-dot" size={24} style={{ color: 'var(--accent-primary)' }} />
            </div>
          ) : !trialsData ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se pudieron cargar los datos de ensayos.
            </div>
          ) : (
            <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                    {trialsData.columns.map((colName, colIdx) => (
                      <th 
                        key={colIdx} 
                        style={{ 
                          padding: '1rem', 
                          textAlign: 'left', 
                          fontWeight: '600', 
                          color: 'var(--text-primary)',
                          borderRight: '1px solid var(--border-color)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span>{colName}</span>
                          {isAdmin && (
                            <div style={{ display: 'flex', gap: '0.2rem' }}>
                              <button 
                                type="button"
                                onClick={() => handleRenameColumn(colIdx)} 
                                className="btn btn-icon btn-sm" 
                                style={{ padding: '0.2rem', minWidth: 'auto', minHeight: 'auto' }} 
                                title="Renombrar columna"
                              >
                                <Edit2 size={10} />
                              </button>
                              {trialsData.columns.length > 2 && (
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteColumn(colIdx)} 
                                  className="btn btn-icon btn-sm" 
                                  style={{ padding: '0.2rem', minWidth: 'auto', minHeight: 'auto', color: 'var(--state-danger)' }} 
                                  title="Eliminar columna"
                                >
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '600' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trialsData.rows.map((rowName, rowIdx) => {
                    const isRowLocked = trialsData.columns.some((_, colIdx) => {
                      return trialsData.cells[`${rowIdx}_${colIdx}`]?.confirmed === true;
                    });

                    return (
                      <tr 
                        key={rowIdx} 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: isRowLocked ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {/* Celdas de datos (incluyendo la primera columna 'Método') */}
                        {trialsData.columns.map((_, colIdx) => {
                          const cellKey = `${rowIdx}_${colIdx}`;
                          const cell = trialsData.cells[cellKey];
                          const isConfirmed = cell?.confirmed === true;

                          return (
                            <td 
                              key={colIdx} 
                              style={{ 
                                padding: '0.5rem', 
                                borderRight: '1px solid var(--border-color)',
                                minWidth: '130px',
                                backgroundColor: colIdx === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                              }}
                            >
                              {isConfirmed && !isAdmin ? (
                                <div 
                                  style={{ 
                                    padding: '0.4rem 0.6rem', 
                                    color: 'var(--text-secondary)', 
                                    backgroundColor: 'rgba(16,185,129,0.04)', 
                                    borderRadius: '6px', 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    gap: '0.4rem',
                                    border: '1px dashed rgba(16,185,129,0.2)',
                                    fontSize: '0.8rem',
                                    fontWeight: colIdx === 0 ? '600' : 'normal'
                                  }}
                                  title="Campo bloqueado y verificado"
                                >
                                  <Lock size={12} style={{ color: 'var(--state-approved)', flexShrink: 0, marginTop: '0.15rem' }} />
                                  <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', width: '100%', textAlign: 'left' }}>{cell?.value || ''}</span>
                                </div>
                              ) : (
                                <textarea 
                                  className="form-input" 
                                  rows={2}
                                  style={{ 
                                    width: '100%', 
                                    padding: '0.4rem 0.6rem', 
                                    fontSize: '0.8rem',
                                    fontWeight: colIdx === 0 ? '600' : 'normal',
                                    backgroundColor: isConfirmed ? 'rgba(16,185,129,0.02)' : 'var(--bg-primary)',
                                    borderColor: isConfirmed ? 'var(--state-approved)' : 'var(--border-color)',
                                    borderRadius: '6px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    minHeight: '44px',
                                    lineHeight: '1.4',
                                    whiteSpace: 'pre-wrap'
                                  }} 
                                  value={cell?.value || ''} 
                                  onChange={e => handleCellChange(rowIdx, colIdx, e.target.value)} 
                                  placeholder={colIdx === 0 ? "Nombre de ensayo..." : "Escribir resultado..."} 
                                />
                              )}
                            </td>
                          );
                        })}

                        {/* Celda de Acciones (Confirmar / Desbloquear / Eliminar Fila) */}
                        <td style={{ padding: '0.5rem', textAlign: 'center', minWidth: '180px' }}>
                          <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', alignItems: 'center' }}>
                            <button 
                              type="button"
                              onClick={() => setSelectedViewTrialRow(rowIdx)} 
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                              title="Ver todos los campos del ensayo en detalle"
                            >
                              <ExternalLink size={12} /> Ver
                            </button>
                            {isAdmin ? (
                              <>
                                {isRowLocked ? (
                                  <button 
                                    type="button"
                                    onClick={() => handleUnlockRow(rowIdx)} 
                                    className="btn btn-secondary btn-sm"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                  >
                                    <Unlock size={12} /> Desbloquear
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Editable</span>
                                )}
                                {trialsData.rows.length > 1 && (
                                  <button 
                                    type="button"
                                    onClick={() => handleDeleteRow(rowIdx)} 
                                    className="btn btn-icon btn-sm" 
                                    style={{ padding: '0.2rem', minWidth: 'auto', minHeight: 'auto', color: 'var(--state-danger)' }} 
                                    title="Eliminar fila"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </>
                            ) : (
                              isRowLocked ? (
                                <span 
                                  className="status-pill approved" 
                                  style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.25rem', 
                                    fontSize: '0.7rem', 
                                    padding: '0.25rem 0.5rem', 
                                    borderRadius: '4px', 
                                    backgroundColor: 'var(--state-approved-bg)', 
                                    color: 'var(--state-approved)', 
                                    fontWeight: 600 
                                  }}
                                >
                                  <Lock size={10} /> Confirmado
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleConfirmRow(rowIdx)} 
                                  disabled={!isRowFilled(rowIdx)} 
                                  style={{ 
                                    backgroundColor: isRowFilled(rowIdx) ? 'var(--state-approved)' : 'var(--border-color)',
                                    color: isRowFilled(rowIdx) ? '#ffffff' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: isRowFilled(rowIdx) ? 'pointer' : 'not-allowed',
                                    opacity: isRowFilled(rowIdx) ? 1 : 0.6,
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.25rem', 
                                    padding: '0.3rem 0.6rem', 
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                  }}
                                >
                                  <Check size={12} /> Confirmar
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Botones de Estructura para el Administrador */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <button 
                    type="button"
                    onClick={handleAddRow} 
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Plus size={14} /> Agregar Ensayo (Fila)
                  </button>
                  <button 
                    type="button"
                    onClick={handleAddColumn} 
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Plus size={14} /> Agregar Parámetro (Columna)
                  </button>
                </div>
              )}
            </div>
          )}
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
                    <option value="Mateo.M">Mateo.M</option>
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
                  <label>Contenido de la Nota (Soporta Markdown)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Escribe tu nota aquí..."
                    rows={12}
                    value={noteForm.content}
                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                    style={{ fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  {noteForm.file_url ? (
                    <div className="form-group">
                      <label>{isImageFile(noteForm.file_url) ? 'Imagen Adjunta' : 'Documento Adjunto'}</label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isImageFile(noteForm.file_url) ? (
                            <img src={noteForm.file_url} alt="Miniatura" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          ) : (
                            <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
                          )}
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {isImageFile(noteForm.file_url) ? 'Imagen cargada con éxito' : 'Archivo cargado con éxito'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <a href={noteForm.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            Ver <ExternalLink size={12} />
                          </a>
                          <button type="button" onClick={handleRemoveNoteFile} className="btn btn-danger btn-sm btn-icon" style={{ width: '28px', height: '28px', padding: 0 }} title="Quitar archivo">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Adjuntar Documento o Imagen (PDF/Word/Imagen...)</label>
                      <div style={{ marginTop: '0.25rem' }}>
                        <label className="btn btn-secondary btn-sm" style={{ width: 'fit-content', cursor: 'pointer', display: 'inline-flex', gap: '0.4rem' }}>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp" 
                            style={{ display: 'none' }} 
                            onChange={handleNoteFileUpload}
                            disabled={uploadingNoteFile}
                          />
                          <Upload size={14} />
                          {uploadingNoteFile ? 'Subiendo archivo...' : 'Subir Documento o Imagen'}
                        </label>
                      </div>
                    </div>
                  )}
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
              {selectedViewNote.content && <MarkdownRenderer content={selectedViewNote.content} />}
              {selectedViewNote.file_url && (
                isImageFile(selectedViewNote.file_url) ? (
                  <div style={{ marginTop: selectedViewNote.content ? '1.5rem' : '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <div style={{ width: '100%', maxHeight: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', backgroundColor: '#070a13' }}>
                      <img 
                        src={selectedViewNote.file_url} 
                        alt={selectedViewNote.title} 
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
                      />
                    </div>
                    <a href={selectedViewNote.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                      <ExternalLink size={14} /> Ver en tamaño completo
                    </a>
                  </div>
                ) : (
                  <div style={{ marginTop: selectedViewNote.content ? '1.5rem' : '0px', padding: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                    <FileText size={36} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Documento Adjunto disponible</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Este registro cuenta con un archivo externo adjunto.</p>
                    </div>
                    <a href={selectedViewNote.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <ExternalLink size={16} /> Abrir Documento Adjunto
                    </a>
                  </div>
                )
              )}
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
                    onClick={() => handleDownloadNotePDF(selectedViewNote)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Download size={14} /> Descargar PDF
                  </button>
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
         MODAL: DETALLES DEL ENSAYO
         ==================================================================== */}
      {selectedViewTrialRow !== null && trialsData && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)' }}>
                <Beaker size={18} style={{ color: 'var(--accent-primary)' }} />
                Detalles del Ensayo (Fila {selectedViewTrialRow + 1})
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedViewTrialRow(null)}>×</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {trialsData.columns.map((colName, colIdx) => {
                  const cellKey = `${selectedViewTrialRow}_${colIdx}`;
                  const cellValue = trialsData.cells[cellKey]?.value || '';
                  const isConfirmed = trialsData.cells[cellKey]?.confirmed === true;

                  return (
                    <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {colName}
                        </span>
                        {isConfirmed && (
                          <span className="status-pill approved" style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            <Lock size={8} /> Confirmado
                          </span>
                        )}
                      </div>
                      <div 
                        style={{ 
                          whiteSpace: 'pre-wrap', 
                          backgroundColor: 'var(--bg-primary)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-color)',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          minHeight: '40px',
                          lineHeight: '1.5',
                          wordBreak: 'break-word',
                          textAlign: 'left'
                        }}
                      >
                        {cellValue || <em style={{ color: 'var(--text-muted)' }}>Sin registrar</em>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setSelectedViewTrialRow(null)}
              >
                Cerrar
              </button>
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
