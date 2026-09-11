import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, Clock, AlertTriangle, ArrowRight, 
  Calendar, User, Sparkles, Trophy, Zap, Layers, Wallet, 
  Check, ChevronRight, BarChart3, AlertCircle, Info, ExternalLink,
  ShieldCheck, ArrowUpRight, GraduationCap, BatteryCharging, Wrench, Paintbrush,
  Radio, Code, Cpu, LayoutGrid, Filter
} from 'lucide-react';
import { getProjectPhase } from '../services/db';
import DependencyGraphCanvas from './roadmap/DependencyGraphCanvas';
import PhasesBoardView from './roadmap/PhasesBoardView';
import NodeInspectorDrawer from './roadmap/NodeInspectorDrawer';
import { ROADMAP_PROJECTS } from '../data/roadmapGraphData';

export default function DashboardOverview({ 
  projects = [], 
  materials = [], 
  tasks = [], 
  onSelectProject, 
  onNavigate 
}) {
  // Modo de vista: 'graph' (Árbol de Dependencias con SVG) | 'board' (Tablero por Fases) | 'finance' (Métricas)
  const [activeViewMode, setActiveViewMode] = useState('graph');
  
  // Filtro de rama de proyecto: 'all' | 'copter' | 'dock' | 'remote' | 'vtol' | 'avion' | 'fondo' | 'pista'
  const [selectedFilterProject, setSelectedFilterProject] = useState('all');

  // Selector de etapa para la vista financiera: 'etapa_2' | 'etapa_1' | 'all'
  const [selectedStage, setSelectedStage] = useState('etapa_2');
  
  // Nodo seleccionado para el panel inspector lateral
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Navegación desde el inspector a un proyecto en el dashboard
  const handleNavigateToProject = (roadmapProjId) => {
    let matched = null;
    if (roadmapProjId === 'copter') matched = projects.find(p => p.name?.toLowerCase().includes('copter'));
    else if (roadmapProjId === 'dock') matched = projects.find(p => p.name?.toLowerCase().includes('doc'));
    else if (roadmapProjId === 'remote') matched = projects.find(p => p.name?.toLowerCase().includes('remote'));
    else if (roadmapProjId === 'vtol') matched = projects.find(p => p.name?.toLowerCase().includes('betol'));
    else if (roadmapProjId === 'avion') matched = projects.find(p => p.name?.toLowerCase().includes('avión') || p.name?.toLowerCase().includes('avion'));
    else if (roadmapProjId === 'fondo') matched = projects.find(p => p.name?.toLowerCase().includes('fondo') || p.name?.toLowerCase().includes('concurso'));

    if (matched && onSelectProject) {
      onSelectProject(matched.id);
    }
  };

  // Fecha de referencia actual: 10 de Septiembre de 2026
  const TODAY_STR = '2026-09-10';
  const todayDate = new Date(TODAY_STR);

  // Filtrado de proyectos activos (Etapa 2)
  const activeProjects = projects.filter(p => getProjectPhase(p) === 'etapa_2');

  // --- CÁLCULO DE SALUD Y RETRASOS EN TIEMPO REAL ---
  const calculateProjectHealth = (project) => {
    if (!project) return { status: 'on_track', label: 'Al día', colorClass: 'green', days: 0 };
    
    const projectTasks = tasks.filter(t => t.project_id === project.id);
    const pendingTasks = projectTasks.filter(t => t.status !== 'done');
    
    let hasOverdue = false;
    let minDiffDays = Infinity;
    let nextTask = null;

    pendingTasks.forEach(t => {
      if (!t.due_date) return;
      const dueDate = new Date(t.due_date);
      const diffTime = dueDate.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        hasOverdue = true;
      }
      if (diffDays >= 0 && diffDays < minDiffDays) {
        minDiffDays = diffDays;
        nextTask = t;
      }
    });

    if (hasOverdue) {
      return {
        status: 'overdue',
        label: 'Atrasado',
        colorClass: 'red',
        days: minDiffDays < 0 ? minDiffDays : 0,
        nextTask
      };
    }

    if (minDiffDays <= 8 && minDiffDays !== Infinity) {
      return {
        status: 'imminent',
        label: `Hito en ${minDiffDays}d`,
        colorClass: 'yellow',
        days: minDiffDays,
        nextTask
      };
    }

    return {
      status: 'on_track',
      label: minDiffDays !== Infinity ? `Al día (${minDiffDays}d)` : 'Al día',
      colorClass: 'green',
      days: minDiffDays !== Infinity ? minDiffDays : 30,
      nextTask
    };
  };

  // Salud de proyectos específicos
  const skycopterProj = activeProjects.find(p => p.name?.toLowerCase().includes('copter'));
  const skydocProj = activeProjects.find(p => p.name?.toLowerCase().includes('doc'));
  const skyremoteProj = activeProjects.find(p => p.name?.toLowerCase().includes('remote'));
  const skybetolProj = activeProjects.find(p => p.name?.toLowerCase().includes('betol'));
  const avionProj = activeProjects.find(p => p.name?.toLowerCase().includes('avión') || p.name?.toLowerCase().includes('avion'));
  const fondoUsmProj = activeProjects.find(p => p.name?.toLowerCase().includes('fondo') || p.name?.toLowerCase().includes('concurso'));

  const copterHealth = calculateProjectHealth(skycopterProj);
  const docHealth = calculateProjectHealth(skydocProj);
  const remoteHealth = calculateProjectHealth(skyremoteProj);
  const betolHealth = calculateProjectHealth(skybetolProj);
  const avionHealth = calculateProjectHealth(avionProj);
  const fondoHealth = calculateProjectHealth(fondoUsmProj);

  // Salud Global del Ecosistema
  const allHealths = [copterHealth, docHealth, remoteHealth, betolHealth, avionHealth, fondoHealth];
  const totalOverdue = allHealths.filter(h => h.status === 'overdue').length;
  const totalImminent = allHealths.filter(h => h.status === 'imminent').length;

  const globalHealth = totalOverdue > 0 
    ? { label: `${totalOverdue} Proyecto Atrasado`, colorClass: 'red', text: 'Hay tareas vencidas que requieren intervención urgente.' }
    : totalImminent > 0
      ? { label: 'Hito Inminente', colorClass: 'yellow', text: 'Ensayos de vuelo Skycopter v2 programados para el 18 de septiembre.' }
      : { label: 'Ecosistema al Día', colorClass: 'green', text: 'Todos los proyectos de la Etapa 2 avanzan según cronograma.' };

  // --- CÁLCULOS FINANCIEROS (Pestaña Finanzas) ---
  const filteredProjectsForFinance = projects.filter(p => {
    if (selectedStage === 'all') return true;
    return getProjectPhase(p) === selectedStage;
  });

  const filteredProjectIds = new Set(filteredProjectsForFinance.map(p => p.id));
  const filteredMaterials = materials.filter(m => filteredProjectIds.has(m.project_id));

  const totalBudget = filteredProjectsForFinance.reduce((sum, p) => sum + Number(p.budget), 0);
  const approvedExpenses = filteredMaterials
    .filter(m => m.status === 'approved' || m.status === 'purchased')
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
  const spentExpenses = filteredMaterials
    .filter(m => (m.status === 'approved' || m.status === 'purchased') && (m.purchase_status === 'pedido' || m.purchase_status === 'disponible'))
    .reduce((sum, m) => sum + (Number(m.unit_price) * Number(m.quantity)), 0);
  const availableBudget = totalBudget - spentExpenses;

  return (
    <div className="dashboard-executive-container dashboard-fullscreen-roadmap">
      {/* ====================================================================
          1. GRAFO DE DEPENDENCIAS INTERACTIVO (SVG BÉZIER + PAN & ZOOM)
         ==================================================================== */}
      {activeViewMode === 'graph' && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', flex: 1 }}>
          <DependencyGraphCanvas 
            selectedProjectId={selectedFilterProject}
            onSelectNode={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        </div>
      )}

      {/* ====================================================================
          4. MODO 2: TABLERO COMPACTO POR FASES (ZERO SCROLL HORIZONTAL)
         ==================================================================== */}
      {activeViewMode === 'board' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PhasesBoardView 
            selectedProjectId={selectedFilterProject}
            onSelectNode={setSelectedNodeId}
          />
        </div>
      )}

      {/* ====================================================================
          3. VISTA FINANCIERA Y MÉTRICAS (MODO SECUNDARIO)
         ==================================================================== */}
      {activeViewMode === 'finance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Selector de Etapa de Finanzas */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={18} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {selectedStage === 'etapa_2' ? 'Presupuesto Etapa 2 (Nuevas Versiones)' : 'Cierre Etapa 1 (Prototipos Expo Seguridad)'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedStage('etapa_2')}
                className={`btn btn-sm ${selectedStage === 'etapa_2' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Etapa 2 (Activa)
              </button>
              <button
                onClick={() => setSelectedStage('etapa_1')}
                className={`btn btn-sm ${selectedStage === 'etapa_1' ? 'btn-primary' : 'btn-secondary'}`}
                style={selectedStage === 'etapa_1' ? { backgroundColor: 'var(--state-approved)' } : {}}
              >
                Etapa 1 (Expo Seguridad)
              </button>
              <button
                onClick={() => setSelectedStage('all')}
                className={`btn btn-sm ${selectedStage === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Consolidado
              </button>
            </div>
          </div>

          {/* Grid de Métricas de Finanzas */}
          <div className="metrics-grid">
            <div className="card metric-card">
              <div className="metric-icon-box">
                <Wallet size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-value">CLP {totalBudget.toLocaleString('en-US')}</span>
                <span className="metric-label">Presupuesto</span>
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-icon-box orange">
                <Wallet size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-value">CLP {spentExpenses.toLocaleString('en-US')}</span>
                <span className="metric-label">Total Gastado</span>
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-icon-box green">
                <Wallet size={22} />
              </div>
              <div className="metric-info">
                <span className="metric-value">CLP {availableBudget.toLocaleString('en-US')}</span>
                <span className="metric-label">Disponible</span>
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-icon-box">
                <Wallet size={22} style={{ color: '#a855f7' }} />
              </div>
              <div className="metric-info">
                <span className="metric-value">CLP {approvedExpenses.toLocaleString('en-US')}</span>
                <span className="metric-label">Aprobado</span>
              </div>
            </div>
          </div>

          {/* Tabla de Proyectos y Presupuestos */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>
              Detalle de Proyectos en esta Selección ({filteredProjectsForFinance.length})
            </h4>

            <div className="table-container">
              <table className="notion-view-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Líder</th>
                    <th>Estado</th>
                    <th>Presupuesto</th>
                    <th>Fecha / Plazo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjectsForFinance.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.leader_name}</td>
                      <td>
                        <span className={`notion-status-pill ${p.status === 'Completado' ? 'completado' : 'en-progreso'}`}>
                          <span className="dot"></span> {p.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {Number(p.budget) === 0 ? 'CLP 0 (Por reasignar)' : `CLP ${Number(p.budget).toLocaleString('en-US')}`}
                      </td>
                      <td>{p.due_date}</td>
                      <td>
                        <button 
                          onClick={() => onSelectProject(p.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botón de retorno al Árbol */}
          {/* Botón de retorno al Grafo */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setActiveViewMode('graph')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <GitBranch size={16} />
              <span>Volver al Grafo de Dependencias</span>
            </button>
          </div>

        </div>
      )}

      {/* Panel Inspector Lateral Interactivo */}
      {selectedNodeId && (
        <NodeInspectorDrawer 
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          onSelectNode={setSelectedNodeId}
          onNavigateToProject={handleNavigateToProject}
        />
      )}

    </div>
  );
}
