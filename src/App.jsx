import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Folder, ShieldAlert, Wifi, WifiOff, 
  Menu, X, RefreshCw, HelpCircle, Image, CheckCircle2,
  Sparkles, Shield, Calendar, GitBranch, LayoutGrid, Wallet,
  CalendarRange, Receipt
} from 'lucide-react';
import { dbService, supabase } from './services/db';
import { getTeamMember } from './services/team';
import DashboardOverview from './components/DashboardOverview';
import ProjectDetails from './components/ProjectDetails';
import AdminConsole from './components/AdminConsole';
import AboutModal from './components/AboutModal';
import ProfileSelector from './components/ProfileSelector';
import MateoSpace from './components/MateoSpace';
import PinModal from './components/PinModal';
import ProjectsFundsOverview from './components/ProjectsFundsOverview';
import AvailabilityView from './components/AvailabilityView';
import RendicionesView from './components/RendicionesView';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'project' | 'admin'
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // About Us Modal State
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
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

  // User Profile State ('guest' | 'mateo' | memberId)
  const [currentProfile, setCurrentProfile] = useState(() => {
    return localStorage.getItem('uavusm_current_profile') || 'guest';
  });

  // Authenticated user in this session
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    return sessionStorage.getItem('uavusm_auth_user') || (sessionStorage.getItem('uavusm_admin_session') === 'true' ? 'mateo' : null);
  });

  // Auth Modal State (supports login & first-time creation for any member)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTargetMember, setAuthTargetMember] = useState(null);

  const handleOpenAuthModal = (member) => {
    setAuthTargetMember(member || getTeamMember('mateo'));
    setIsAuthModalOpen(true);
  };

  const handleSelectProfile = (profileId) => {
    if (profileId === 'guest') {
      handleSetIsAdmin(false);
      setAuthenticatedUser(null);
      sessionStorage.removeItem('uavusm_auth_user');
      setCurrentProfile('guest');
      localStorage.setItem('uavusm_current_profile', 'guest');
      if (activeView === 'mateo' || activeView === 'admin') {
        setActiveView('overview');
      }
      return;
    }

    setCurrentProfile(profileId);
    localStorage.setItem('uavusm_current_profile', profileId);
  };

  const handleAuthSuccess = (member) => {
    setIsAuthModalOpen(false);
    const memberId = member?.id || 'mateo';
    setAuthenticatedUser(memberId);
    sessionStorage.setItem('uavusm_auth_user', memberId);

    if (memberId === 'mateo') {
      handleSetIsAdmin(true);
      setCurrentProfile('mateo');
      localStorage.setItem('uavusm_current_profile', 'mateo');
      setActiveView('mateo');
    } else {
      handleSetIsAdmin(false);
      setCurrentProfile(memberId);
      localStorage.setItem('uavusm_current_profile', memberId);
    }
  };

  const handleLogout = () => {
    handleSetIsAdmin(false);
    setAuthenticatedUser(null);
    sessionStorage.removeItem('uavusm_auth_user');
    setCurrentProfile('guest');
    localStorage.setItem('uavusm_current_profile', 'guest');
    if (activeView === 'mateo' || activeView === 'admin') {
      setActiveView('overview');
    }
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
      
      await dbService.syncCredentialsFromCloud();
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
            onNavigate={handleNavigate}
          />
        );
      case 'projects_overview':
        return (
          <ProjectsFundsOverview 
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
      case 'mateo':
        return (
          <MateoSpace 
            projects={projects}
            tasks={tasks}
            materials={materials}
            onNavigate={handleNavigate}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
          />
        );
      case 'availability':
        return (
          <AvailabilityView 
            currentProfile={currentProfile}
            isAdmin={isAdmin}
          />
        );
      case 'rendiciones':
        return (
          <RendicionesView 
            currentProfile={currentProfile}
            isAdmin={isAdmin}
            authenticatedUser={authenticatedUser}
            onNavigate={handleNavigate}
            onOpenAuthModal={handleOpenAuthModal}
          />
        );
      default:
        return <p>Vista no encontrada</p>;
    }
  };

  // Get view title helper
  const getViewTitle = () => {
    if (activeView === 'overview') return { title: 'Dashboard General', subtitle: 'Árbol de desarrollo y radar de avance de la iniciativa UAVUSM' };
    if (activeView === 'projects_overview') return { title: 'Proyectos & Fondos', subtitle: 'Presupuestos, balances financieros y catálogo de proyectos' };
    if (activeView === 'availability') return { title: 'Disponibilidad Semanal', subtitle: 'Carga académica USM y capacidad del equipo semana a semana' };
    if (activeView === 'rendiciones') return { title: 'Rendiciones & Reembolsos', subtitle: 'Control de boletas, cortes de rendición y transferencias con Skydrone SpA' };
    if (activeView === 'mateo') return { title: 'Espacio de Mateo', subtitle: 'Dirección técnica y notas privadas de liderazgo' };
    if (activeView === 'admin') return { title: 'Consola de Administración', subtitle: 'Aprobación de materiales y presupuestos' };
    if (activeView === 'project' && activeProject) return { title: activeProject.name, subtitle: `Líder: ${activeProject.leader_name}` };
    return { title: 'UAVUSM Dashboard', subtitle: 'Gestión de proyectos' };
  };

  const { title, subtitle } = getViewTitle();

  return (
    <div className={`app-container ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className="sidebar" style={{ display: isSidebarOpen ? 'flex' : 'none' }}>
        <div className="brand-section" style={{ marginBottom: '1rem' }}>
          <span className="brand-logo">✈️</span>
          <span className="brand-title">UAVUSM</span>
        </div>
        <button 
          onClick={() => setIsAboutModalOpen(true)} 
          className="btn btn-secondary btn-sm" 
          style={{ 
            marginBottom: '0.5rem', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            fontSize: '0.8rem',
            padding: '0.5rem 0.8rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          title="Conoce nuestra historia y proyectos"
        >
          <HelpCircle size={14} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 600 }}>Acerca de UAVUSM</span>
        </button>
        <a 
          href="https://drive.google.com/drive/folders/1iFUKdU15_0uvApBpM8zE9iU4rGqrWMbM?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm" 
          style={{ 
            marginBottom: '1.75rem', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            fontSize: '0.8rem',
            padding: '0.5rem 0.8rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit'
          }}
          title="Ver galería multimedia en Google Drive"
        >
          <Image size={14} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontWeight: 600 }}>Multimedia</span>
        </a>

        <nav className="sidebar-menu">
          <span className="sidebar-heading">Iniciativa</span>
          <div 
            className={`menu-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavigate('overview')}
            title="Árbol de desarrollo y radar de avance"
          >
            <GitBranch size={18} />
            <span>Resumen General</span>
          </div>

          <div 
            className={`menu-item ${activeView === 'projects_overview' ? 'active' : ''}`}
            onClick={() => handleNavigate('projects_overview')}
            title="Tablero general de proyectos, presupuestos y gráficos financieros"
          >
            <LayoutGrid size={18} />
            <span>Proyectos & Fondos</span>
          </div>

          <div 
            className={`menu-item ${activeView === 'availability' ? 'active' : ''}`}
            onClick={() => handleNavigate('availability')}
            title="Disponibilidad semanal del equipo y calendario académico USM"
          >
            <CalendarRange size={18} />
            <span>Disponibilidad Equipo</span>
          </div>

          {currentProfile === 'mateo' && isAdmin && (
            <div 
              className={`menu-item ${activeView === 'mateo' ? 'active' : ''}`}
              onClick={() => handleNavigate('mateo')}
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              <Sparkles size={18} />
              <span>Espacio de Mateo</span>
            </div>
          )}

          {(currentProfile === 'mateo' || currentProfile === 'nicolas' || authenticatedUser === 'mateo' || authenticatedUser === 'nicolas' || isAdmin) && (
            <div 
              className={`menu-item ${activeView === 'rendiciones' ? 'active' : ''}`}
              onClick={() => handleNavigate('rendiciones')}
              style={{ color: '#38bdf8' }}
              title="Control de boletas, rendiciones y conciliación con Skydrone SpA (Mateo & Nicolás)"
            >
              <Receipt size={18} />
              <span>Rendiciones</span>
            </div>
          )}

          {isAdmin && (
            <div 
              className={`menu-item ${activeView === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavigate('admin')}
            >
              <Shield size={18} />
              <span>Consola Admin</span>
            </div>
          )}

          <span className="sidebar-heading">Proyectos Activos (Etapa 2)</span>
          {projects.filter(p => p.status !== 'Completado').map(p => {
            const shortName = p.name.split(':')[0];
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

          {projects.some(p => p.status === 'Completado') && (
            <>
              <span className="sidebar-heading" style={{ marginTop: '1.25rem' }}>Etapa 1 (Expo Seguridad)</span>
              {projects.filter(p => p.status === 'Completado').map(p => {
                const shortName = p.name.split(':')[0];
                return (
                  <div 
                    key={p.id}
                    className={`menu-item ${activeView === 'project' && selectedProjectId === p.id ? 'active' : ''}`}
                    onClick={() => handleSelectProject(p.id)}
                    style={{ opacity: 0.8 }}
                    title="Proyecto culminado y presentado en Expo Seguridad"
                  >
                    <CheckCircle2 size={16} style={{ color: 'var(--state-approved)', flexShrink: 0 }} />
                    <span>{shortName}</span>
                  </div>
                );
              })}
            </>
          )}
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

          <div className="actions-section" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Selector de Perfil (Showcase / Mateo / Equipo) */}
            <ProfileSelector 
              currentProfile={currentProfile}
              onSelectProfile={handleSelectProfile}
              isAdmin={isAdmin}
              authenticatedUser={authenticatedUser}
              onOpenMateoSpace={() => handleNavigate('mateo')}
              onOpenAuthModal={handleOpenAuthModal}
              onOpenPinModal={(target) => handleOpenAuthModal(target || getTeamMember('mateo'))}
              onLogoutAdmin={handleLogout}
            />

            <button 
              onClick={() => setIsAboutModalOpen(true)} 
              className="btn btn-secondary btn-icon" 
              style={{ borderRadius: '8px' }}
              title="Acerca de UAVUSM"
            >
              <HelpCircle size={16} />
            </button>
            <button 
              onClick={fetchData} 
              className={`btn btn-secondary btn-icon ${loading ? 'pulse-dot' : ''}`} 
              style={{ borderRadius: '8px' }}
              title="Sincronizar datos"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className={`content-container ${activeView === 'overview' ? 'content-container-roadmap' : ''}`}>
          {currentProfile === 'guest' && activeView !== 'overview' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.35rem 0.85rem',
              marginBottom: '0.75rem',
              backgroundColor: 'rgba(14, 165, 233, 0.05)',
              border: '1px solid rgba(14, 165, 233, 0.15)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary, #94a3b8)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem' }}>🌐</span>
                <span>Modo Showcase (Solo Lectura)</span>
              </div>
              <button
                onClick={() => handleOpenAuthModal(getTeamMember('mateo'))}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '5px' }}
              >
                Acceso Miembros / Mateo →
              </button>
            </div>
          )}
          <ErrorBoundary key={activeView + (selectedProjectId || '')}>
            {renderViewContent()}
          </ErrorBoundary>
        </div>
      </main>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
        projects={projects} 
      />

      <PinModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        targetMember={authTargetMember}
      />
    </div>
  );
}
