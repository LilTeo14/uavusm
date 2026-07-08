import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, CheckSquare, Clock, AlertCircle, ArrowRight, LayoutGrid, Table, FileText, Calendar, User } from 'lucide-react';

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#a855f7', '#6366f1'];

export default function DashboardOverview({ projects, materials, tasks, onSelectProject }) {
  const [viewType, setViewType] = useState('table'); // 'table' | 'grid'

  // --- CÁLCULOS DE MÉTRICAS ---
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);
  
  // Gastos aprobados o comprados (Total Aprobado)
  const approvedExpenses = materials
    .filter(m => m.status === 'approved' || m.status === 'purchased')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Gastos reales (Total Gastado: en estado de pedido "Pedido" o "Disponible")
  const spentExpenses = materials
    .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Presupuesto disponible (Disponible = Presupuesto Total - Gastado)
  const availableBudget = totalBudget - spentExpenses;

  // Gastos pendientes de aprobación
  const pendingExpenses = materials
    .filter(m => m.status === 'pending')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

  // Estadísticas de tareas
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'done').length;
  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // --- DATOS PARA GRÁFICOS ---
  // 1. Gráfico de Barras: Presupuesto vs Aprobado vs Gastado por Proyecto
  const barChartData = projects.map(p => {
    const projectMaterials = materials.filter(m => m.project_id === p.id);
    const approved = projectMaterials
      .filter(m => m.status === 'approved' || m.status === 'purchased')
      .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
    const spent = projectMaterials
      .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
      .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

    return {
      name: p.name,
      Presupuesto: Number(p.budget),
      Aprobado: approved,
      Gastado: spent
    };
  });

  // 2. Gráfico de Torta: Distribución del Gasto Real por Proyecto
  const pieChartData = projects.map((p, index) => {
    const projectMaterials = materials.filter(m => m.project_id === p.id);
    const spent = projectMaterials
      .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
      .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);

    return {
      name: p.name,
      value: spent
    };
  }).filter(d => d.value > 0); // Solo mostrar proyectos con gastos reales

  // Helper date formatter: formats "YYYY-MM-DD" to "July 31, 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    // Split date string to avoid timezone shifts
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Helper status class for Notion view
  const getNotionStatusClass = (status) => {
    if (!status) return 'por-iniciar';
    const s = status.toLowerCase();
    if (s === 'por iniciar') return 'por-iniciar';
    if (s === 'en progreso' || s === 'en_progreso') return 'en-progreso';
    if (s === 'completado' || s === 'done') return 'completado';
    return 'por-iniciar';
  };

  return (
    <div className="dashboard-overview">
      {/* Grid de Métricas Clave */}
      <div className="metrics-grid">
        {/* 1. Presupuesto Total */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <Wallet size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {totalBudget.toLocaleString('en-US')}</span>
            <span className="metric-label">Presupuesto Total</span>
          </div>
        </div>

        {/* 2. Total Gastado */}
        <div className="card metric-card">
          <div className="metric-icon-box orange">
            <Wallet size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {spentExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Total Gastado</span>
          </div>
        </div>

        {/* 3. Presupuesto Disponible */}
        <div className="card metric-card">
          <div className="metric-icon-box green">
            <Wallet size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {availableBudget.toLocaleString('en-US')}</span>
            <span className="metric-label">Presupuesto Disponible</span>
          </div>
        </div>

        {/* 4. Total Aprobado */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <Wallet size={24} style={{ color: '#a855f7' }} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {approvedExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Total Aprobado</span>
          </div>
        </div>

        {/* 5. Pendiente Aprobación */}
        <div className="card metric-card">
          <div className="metric-icon-box orange" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--state-pending)', borderColor: 'rgba(234, 179, 8, 0.15)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">CLP {pendingExpenses.toLocaleString('en-US')}</span>
            <span className="metric-label">Pendiente Aprobación</span>
          </div>
        </div>

        {/* 6. Tareas Completadas */}
        <div className="card metric-card">
          <div className="metric-icon-box">
            <CheckSquare size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{taskCompletionRate}%</span>
            <span className="metric-label">Tareas Completadas ({completedTasksCount}/{totalTasksCount})</span>
          </div>
        </div>
      </div>

      {/* Gráficos Estadísticos */}
      <div className="dashboard-grid-charts">
        {/* Presupuesto vs Gastos */}
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Presupuesto Asignado vs. Gastos (CLP)</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a354f" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121826', borderColor: '#2e3d5c', color: '#f8fafc' }}
                  formatter={(value) => [`CLP ${Number(value).toLocaleString('en-US')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Presupuesto" fill="#0ea5e9" name="Presupuesto" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Aprobado" fill="#a855f7" name="Aprobado" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gastado" fill="#f97316" name="Gastado (Pedidos/Disp.)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución del Gasto */}
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
                    formatter={(value) => [`CLP ${Number(value).toLocaleString('en-US')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Wallet size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p>No hay gastos reales aún.</p>
              </div>
            )}
            
            {/* Leyenda Personalizada para Torta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
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

      {/* Listado de Proyectos */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>Nuestros Proyectos Estudiantiles</h2>
          
          {/* Alternador de Vista (Estilo Notion vs Tarjetas) */}
          <div className="view-toggle-container">
            <button 
              className={`view-toggle-btn ${viewType === 'table' ? 'active' : ''}`}
              onClick={() => setViewType('table')}
              title="Vista de Tabla estilo Notion"
            >
              <Table size={14} />
              <span>Vista Notion</span>
            </button>
            <button 
              className={`view-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
              onClick={() => setViewType('grid')}
              title="Vista de Tarjetas Premium"
            >
              <LayoutGrid size={14} />
              <span>Vista Tarjetas</span>
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
                  <th style={{ width: '22%' }}>Proyecto</th>
                  <th style={{ width: '38%' }}>Descripción</th>
                  <th style={{ width: '12%' }}>Estado</th>
                  <th style={{ width: '12%' }}>Plazo</th>
                  <th style={{ width: '11%' }}>Presupuesto (CLP)</th>
                  <th style={{ width: '15%' }}>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => {
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
                        CLP {Number(project.budget).toLocaleString('en-US')}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ====================================================================
             VISTA DE TARJETAS (ORIGINAL PREMIUM)
             ==================================================================== */
          <div className="projects-grid">
            {projects.map(project => {
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

              const budgetPercent = Math.min(Math.round((spent / Number(project.budget)) * 100), 100);

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
                      <span className="project-badge">Iniciativa UAV</span>
                    </div>
                  ) : (
                    <div 
                      className="project-card-image" 
                      style={{ background: 'linear-gradient(135deg, #1b2336 0%, #0b0f19 100%)' }}
                    >
                      <span className="project-badge">Iniciativa UAV</span>
                    </div>
                  )}
                  
                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.name}</h3>
                    <p className="project-card-description">{project.description}</p>
                    
                    {/* Progreso del Presupuesto */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Presupuesto Gastado</span>
                        <span style={{ fontWeight: 600 }}>{budgetPercent}% (CLP {spent.toLocaleString('en-US')} / CLP {Number(project.budget).toLocaleString('en-US')})</span>
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
                        <span>Disponible: CLP {(Number(project.budget) - spent).toLocaleString('en-US')}</span>
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
