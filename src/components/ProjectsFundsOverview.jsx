import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Wallet, CheckSquare, Clock, AlertCircle, ArrowRight, 
  LayoutGrid, Table, FileText, Calendar, User, Filter,
  Layers, CheckCircle2, DollarSign
} from 'lucide-react';
import { getProjectPhase } from '../services/db';

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#6366f1', '#ec4899', '#eab308'];

export default function ProjectsFundsOverview({ 
  projects = [], 
  materials = [], 
  tasks = [], 
  onSelectProject 
}) {
  const [viewType, setViewType] = useState('grid'); // 'grid' | 'table'
  const [selectedStage, setSelectedStage] = useState('all'); // 'all' | 'etapa_2' | 'etapa_1'

  // --- FILTRADO DE PROYECTOS POR ETAPA ---
  const filteredProjects = projects.filter(p => {
    if (selectedStage === 'all') return true;
    return getProjectPhase(p) === selectedStage;
  });

  const filteredProjectIds = new Set(filteredProjects.map(p => p.id));
  const filteredMaterials = materials.filter(m => filteredProjectIds.has(m.project_id));
  const filteredTasks = tasks.filter(t => filteredProjectIds.has(t.project_id));

  // --- CÁLCULOS DE MÉTRICAS FINANCIERAS ---
  const totalBudget = filteredProjects.reduce((sum, p) => sum + Number(p.budget), 0);
  
  // Gastos aprobados o comprados
  const approvedExpenses = filteredMaterials
    .filter(m => m.status === 'approved' || m.status === 'purchased')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Gastos reales (en estado "pedido" o "disponible")
  const spentExpenses = filteredMaterials
    .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Presupuesto disponible
  const availableBudget = totalBudget - spentExpenses;

  // Gastos pendientes de aprobación
  const pendingExpenses = filteredMaterials
    .filter(m => m.status === 'pending')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Estadísticas de tareas
  const totalTasksCount = filteredTasks.length;
  const completedTasksCount = filteredTasks.filter(t => t.status === 'done').length;
  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // --- DATOS PARA GRÁFICOS ---
  // 1. Torta: Presupuesto Disponible por Proyecto
  const availableBudgetPieData = filteredProjects.map(p => {
    const pMats = materials.filter(m => m.project_id === p.id);
    const spent = pMats
      .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
      .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
    const available = Math.max(0, Number(p.budget) - spent);

    return {
      name: p.name.split(':')[0],
      value: available
    };
  }).filter(d => d.value > 0);

  // 2. Torta: Distribución del Gasto Real por Proyecto
  const pieChartData = filteredProjects.map(p => {
    const pMats = materials.filter(m => m.project_id === p.id);
    const spent = pMats
      .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
      .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

    return {
      name: p.name.split(':')[0],
      value: spent
    };
  }).filter(d => d.value > 0);

  // Formato de fechas
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('es-CL', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  };

  const getNotionStatusClass = (status) => {
    if (!status) return 'por-iniciar';
    const s = status.toLowerCase();
    if (s.includes('iniciar')) return 'por-iniciar';
    if (s.includes('progreso')) return 'en-progreso';
    if (s.includes('completado') || s.includes('done')) return 'completado';
    return 'por-iniciar';
  };

  return (
    <div className="dashboard-overview" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Barra de Filtro de Etapa y Controles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(14, 165, 233, 0.15)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Filtro de Fondos y Proyectos:
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              {selectedStage === 'all' 
                ? `Mostrando todos los proyectos históricos (${filteredProjects.length})` 
                : selectedStage === 'etapa_2' 
                  ? `Etapa 2 Activa (Nuevas versiones v2 y proyectos en curso)` 
                  : `Etapa 1 Cerrada (Fondos y entregas de Expo Seguridad)`}
            </span>
          </div>
        </div>

        {/* Botones de Etapa */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedStage('all')}
            className={`btn btn-sm ${selectedStage === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px', fontSize: '0.8rem' }}
          >
            Todos ({projects.length})
          </button>
          <button
            onClick={() => setSelectedStage('etapa_2')}
            className={`btn btn-sm ${selectedStage === 'etapa_2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px', fontSize: '0.8rem' }}
          >
            Etapa 2 (Activa)
          </button>
          <button
            onClick={() => setSelectedStage('etapa_1')}
            className={`btn btn-sm ${selectedStage === 'etapa_1' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '6px', 
              fontSize: '0.8rem',
              backgroundColor: selectedStage === 'etapa_1' ? 'var(--state-approved)' : undefined
            }}
          >
            Etapa 1 (Expo Seguridad)
          </button>
        </div>
      </div>

      {/* Grid de 6 Métricas Clave */}
      <div className="metrics-grid">
        {/* 1. Presupuesto Total */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {totalBudget.toLocaleString('en-US')}</span>
            <span className="metric-label">Presupuesto Asignado</span>
          </div>
        </div>

        {/* 2. Total Gastado */}
        <div className="card metric-card">
          <div className="metric-icon-box orange">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {spentExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Total Gastado</span>
          </div>
        </div>

        {/* 3. Presupuesto Disponible */}
        <div className="card metric-card">
          <div className="metric-icon-box green">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {availableBudget.toLocaleString('en-US')}</span>
            <span className="metric-label">Presupuesto Disponible</span>
          </div>
        </div>

        {/* 4. Total Aprobado */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <Wallet size={22} style={{ color: '#a855f7' }} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {approvedExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Total Aprobado</span>
          </div>
        </div>

        {/* 5. Pendiente Aprobación */}
        <div className="card metric-card">
          <div className="metric-icon-box orange" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--state-pending)', borderColor: 'rgba(234, 179, 8, 0.15)' }}>
            <AlertCircle size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {pendingExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Pendiente Aprobación</span>
          </div>
        </div>

        {/* 6. Tareas Completadas */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <CheckSquare size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{taskCompletionRate}%</span>
            <span className="metric-label">Tareas Completadas ({completedTasksCount}/{totalTasksCount})</span>
          </div>
        </div>
      </div>

      {/* Gráficos Estadísticos (Torta de Presupuesto Disponible & Torta de Gastos) */}
      <div className="dashboard-grid-charts">
        {/* Presupuesto disponible por proyecto */}
        <div className="card">
          <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="chart-title">Presupuesto Disponible por Proyecto</h3>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Total disponible: <strong style={{ color: 'var(--state-approved)' }}>CLP {availableBudget.toLocaleString('en-US')}</strong>
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {availableBudgetPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={availableBudgetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {availableBudgetPieData.map((entry, index) => (
                      <Cell key={`cell-avail-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121826', borderColor: '#2e3d5c', color: '#f8fafc' }}
                    formatter={(value) => [`CLP ${Number(value).toLocaleString('en-US')}`, 'Disponible']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Wallet size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p>No hay fondos asignados con saldo remanente en esta selección.</p>
              </div>
            )}
            
            {/* Leyenda Personalizada para Torta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 0.8rem', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.725rem' }}>
              {availableBudgetPieData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>{entry.name}: <strong>CLP {entry.value.toLocaleString('en-US')}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribución del Gasto Real */}
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Distribución de Gastos Reales</h3>
          </div>
          <div style={{ width: '100%', height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121826', borderColor: '#2e3d5c', color: '#f8fafc' }}
                    formatter={(value) => [`CLP ${Number(value).toLocaleString('en-US')}`, 'Gastado']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Wallet size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p>No hay gastos registrados en esta selección.</p>
              </div>
            )}
            
            {/* Leyenda Personalizada para Torta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 0.8rem', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.725rem' }}>
              {pieChartData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>{entry.name}: <strong>CLP {entry.value.toLocaleString('en-US')}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo de Proyectos con Alternador de Vista (Tarjetas vs Tabla Notion) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: '0 0 0.25rem 0' }}>
              Catálogo de Proyectos y Presupuestos ({filteredProjects.length})
            </h2>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Detalle financiero individual, avance de hitos y balance de cada iniciativa estudiantil.
            </p>
          </div>
          
          {/* Alternador de Vista (Estilo Notion vs Tarjetas) */}
          <div className="view-toggle-container">
            <button 
              className={`view-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
              onClick={() => setViewType('grid')}
              title="Vista de Tarjetas con Barras de Progreso"
            >
              <LayoutGrid size={14} />
              <span>Vista Tarjetas</span>
            </button>
            <button 
              className={`view-toggle-btn ${viewType === 'table' ? 'active' : ''}`}
              onClick={() => setViewType('table')}
              title="Vista de Tabla estilo Notion"
            >
              <Table size={14} />
              <span>Vista Notion</span>
            </button>
          </div>
        </div>

        {viewType === 'table' ? (
          /* ====================================================================
             VISTA DE TABLA (ESTILO NOTION)
             ==================================================================== */
          <div className="table-container">
            <table className="notion-view-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Proyecto</th>
                  <th style={{ width: '30%' }}>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha Límite</th>
                  <th>Presupuesto</th>
                  <th>Líder</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => {
                  const leaderInitials = project.leader_name
                    ? project.leader_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'U';
                  
                  return (
                    <tr key={project.id}>
                      <td>
                        <div 
                          className="notion-project-name"
                          onClick={() => onSelectProject(project.id)}
                        >
                          <FileText size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                          <span>{project.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {project.description}
                      </td>
                      <td>
                        <span className={`notion-status-pill ${getNotionStatusClass(project.status)}`}>
                          <span className="dot"></span>
                          {project.status || 'Por iniciar'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                          {formatDate(project.due_date)}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {Number(project.budget) === 0 ? 'CLP 0 (Por reasignar)' : `CLP ${Number(project.budget).toLocaleString('en-US')}`}
                      </td>
                      <td>
                        <div className="notion-avatar-container">
                          <span className="notion-avatar" title={project.leader_name}>
                            {leaderInitials[0]}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {project.leader_name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => onSelectProject(project.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ====================================================================
             VISTA DE TARJETAS (ORIGINAL CON BARRAS DE FONDOS Y TAREAS)
             ==================================================================== */
          <div className="projects-grid">
            {filteredProjects.map(project => {
              const projectMaterials = materials.filter(m => m.project_id === project.id);
              const approved = projectMaterials
                .filter(m => m.status === 'approved' || m.status === 'purchased')
                .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
              const spent = projectMaterials
                .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
                .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
              
              const projectTasks = tasks.filter(t => t.project_id === project.id);
              const doneTasks = projectTasks.filter(t => t.status === 'done').length;
              const taskProgress = projectTasks.length > 0 
                ? Math.round((doneTasks / projectTasks.length) * 100) 
                : 0;

              const projBudget = Number(project.budget);
              const budgetPercent = projBudget > 0 ? Math.min(Math.round((spent / projBudget) * 100), 100) : 0;

              const leaderInitials = project.leader_name
                ? project.leader_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'U';

              return (
                <div className="card project-card" key={project.id}>
                  {project.image_url ? (
                    <div 
                      className="project-card-image" 
                      style={{ backgroundImage: `url(${project.image_url})` }}
                    >
                      <span className="project-badge">Iniciativa UAVUSM</span>
                    </div>
                  ) : (
                    <div 
                      className="project-card-image" 
                      style={{ background: 'linear-gradient(135deg, #1b2336 0%, #0b0f19 100%)' }}
                    >
                      <span className="project-badge">Iniciativa UAVUSM</span>
                    </div>
                  )}
                  
                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.name}</h3>
                    <p className="project-card-description">{project.description}</p>
                    
                    {/* Progreso del Presupuesto */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Presupuesto Gastado</span>
                        <span style={{ fontWeight: 600 }}>
                          {projBudget > 0 
                            ? `${budgetPercent}% (CLP ${spent.toLocaleString('en-US')} / CLP ${projBudget.toLocaleString('en-US')})`
                            : `CLP ${spent.toLocaleString('en-US')} (Sin fondo asignado)`}
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${budgetPercent}%`,
                            backgroundColor: budgetPercent > 90 ? 'var(--state-danger)' : budgetPercent > 70 ? 'var(--state-pending)' : 'var(--state-approved)'
                          }}
                        ></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                        <span>Aprobado: CLP {approved.toLocaleString('en-US')}</span>
                        <span>Disponible: CLP {Math.max(0, projBudget - spent).toLocaleString('en-US')}</span>
                      </div>
                    </div>

                    {/* Progreso de Tareas */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Progreso de Tareas</span>
                        <span style={{ fontWeight: 600 }}>{taskProgress}% ({doneTasks}/{projectTasks.length})</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${taskProgress}%` }}></div>
                      </div>
                    </div>

                    <div className="project-card-meta">
                      <div className="meta-item">
                        <span className="meta-label">Líder</span>
                        <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                          <span className="leader-avatar" style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}>
                            {leaderInitials}
                          </span>
                          {project.leader_name}
                        </span>
                      </div>
                      <div className="meta-item" style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <button 
                          onClick={() => onSelectProject(project.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Gestionar <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
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
