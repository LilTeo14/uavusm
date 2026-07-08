import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Folder, ShieldAlert, Wifi, WifiOff, 
  Menu, X, RefreshCw, HelpCircle 
} from 'lucide-react';
import { dbService, supabase } from './services/db';
import DashboardOverview from './components/DashboardOverview';
import ProjectDetails from './components/ProjectDetails';
import AdminConsole from './components/AdminConsole';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'project' | 'admin'
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Data State
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Auth State (Shared across sessions to avoid asking PIN every single action)
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('uavusm_admin_session') === 'true';
  });

  const handleSetIsAdmin = (val) => {
    setIsAdmin(val);
    sessionStorage.setItem('uavusm_admin_session', val ? 'true' : 'false');
  };

  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Is Supabase active
  const isCloud = !!supabase;

  // --- OBTENER DATOS ---
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projs = await dbService.getProjects();
      const mats = await dbService.getMaterials();
      const tsks = await dbService.getTasks();
      const nts = await dbService.getNotes();

      setProjects(projs);
      setMaterials(mats);
      setTasks(tsks);
      setNotes(nts);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Ocurrió un error al cargar la información del servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Responsive Sidebar Toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Switch to Project View
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveView('project');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Auto close sidebar on mobile
    }
  };

  // Switch to Overview or Admin
  const handleNavigate = (view) => {
    setActiveView(view);
    setSelectedProjectId(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Find active project object
  const activeProject = projects.find(p => p.id === selectedProjectId);

  // Render current view
  const renderViewContent = () => {
    if (loading && projects.length === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem', color: 'var(--text-secondary)' }}>
          <RefreshCw className="pulse-dot" size={32} style={{ color: 'var(--accent-primary)' }} />
          <p>Cargando información del dashboard...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="card" style={{ borderLeft: '4px solid var(--state-danger)', padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert /> Error al Cargar Datos
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchData} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <RefreshCw size={12} /> Intentar de nuevo
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return (
          <DashboardOverview 
            projects={projects}
            materials={materials}
            tasks={tasks}
            onSelectProject={handleSelectProject}
          />
        );
      case 'project':
        return activeProject ? (
          <ProjectDetails 
            project={activeProject}
            materials={materials}
            tasks={tasks}
            notes={notes}
            onRefresh={fetchData}
            isAdmin={isAdmin}
            setIsAdmin={handleSetIsAdmin}
          />
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Selecciona un proyecto del menú lateral.</p>
        );
      case 'admin':
        return (
          <AdminConsole 
            projects={projects}
            materials={materials}
            onRefresh={fetchData}
            isAdmin={isAdmin}
            setIsAdmin={handleSetIsAdmin}
          />
        );
      default:
        return <p>Vista no encontrada</p>;
    }
  };

  // Get view title helper
  const getViewTitle = () => {
    if (activeView === 'overview') return { title: 'Dashboard General', subtitle: 'Resumen consolidado de la iniciativa UAVUSM' };
    if (activeView === 'admin') return { title: 'Consola de Administración', subtitle: 'Aprobación de materiales y presupuestos' };
    if (activeView === 'project' && activeProject) return { title: activeProject.name, subtitle: `Líder: ${activeProject.leader_name}` };
    return { title: 'UAVUSM Dashboard', subtitle: 'Gestión de proyectos' };
  };

  const { title, subtitle } = getViewTitle();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar" style={{ display: isSidebarOpen ? 'flex' : 'none' }}>
        <div className="brand-section">
          <span className="brand-logo">✈️</span>
          <span className="brand-title">UAVUSM</span>
        </div>

        <nav className="sidebar-menu">
          <span className="sidebar-heading">Iniciativa</span>
          <div 
            className={`menu-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavigate('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Resumen General</span>
          </div>

          <span className="sidebar-heading">Proyectos Activos</span>
          {projects.map(p => {
            const shortName = p.name.split(':')[0]; // UAV-01, UAV-02 etc.
            return (
              <div 
                key={p.id}
                className={`menu-item ${activeView === 'project' && selectedProjectId === p.id ? 'active' : ''}`}
                onClick={() => handleSelectProject(p.id)}
              >
                <Folder size={18} />
                <span>{shortName}</span>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer / Connection Status */}
        <div className="sidebar-footer">
          {isCloud ? (
            <div className="connection-pill online">
              <Wifi size={14} />
              <span className="pulse-dot"></span>
              <span>Supabase Cloud</span>
            </div>
          ) : (
            <div className="connection-pill offline" title="Almacenando localmente en el navegador. Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas en .env">
              <WifiOff size={14} />
              <span>Modo Local Storage</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleSidebar} 
              className="btn btn-secondary btn-icon"
              style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              title="Alternar Menú"
            >
              <Menu size={18} />
            </button>
            <div className="page-title-section">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="actions-section">
            <button 
              onClick={fetchData} 
              className={`btn btn-secondary btn-icon ${loading ? 'pulse-dot' : ''}`} 
              style={{ borderRadius: '8px' }}
              title="Sincronizar datos"
            >
              <RefreshCw size={16} />
            </button>
            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="status-pill approved" style={{ fontSize: '0.7rem' }}>
                  Modo Administrador
                </span>
                <button 
                  onClick={() => handleSetIsAdmin(false)} 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="content-container">
          {renderViewContent()}
        </div>
      </main>
    </div>
  );
}
