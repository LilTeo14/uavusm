import React from 'react';
import { 
  X, BookOpen, Rocket, Award, Users, 
  Layers, Cpu, Eye, Flag, Shield, HelpCircle
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose, projects = [] }) {
  if (!isOpen) return null;

  // Helper to map project names to specific icons
  const getProjectIcon = (projectName) => {
    const name = projectName.toLowerCase();
    if (name.includes('dock')) return <Layers size={14} />;
    if (name.includes('recubrimiento') || name.includes('vtol') || name.includes('skyvtol')) return <Shield size={14} />;
    if (name.includes('design') || name.includes('copter')) return <Cpu size={14} />;
    if (name.includes('ar') || name.includes('module') || name.includes('vision')) return <Eye size={14} />;
    if (name.includes('pista') || name.includes('carreras') || name.includes('track')) return <Flag size={14} />;
    return <Rocket size={14} />;
  };

  // Helper to format status names to lowercase styling classes
  const getStatusClass = (status) => {
    if (!status) return 'por-iniciar';
    const s = status.toLowerCase();
    if (s === 'por iniciar') return 'por-iniciar';
    if (s === 'en progreso' || s === 'en_progreso') return 'en-progreso';
    if (s === 'completado' || s === 'done') return 'completado';
    return 'por-iniciar';
  };

  // Get status color coding style
  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'completado' || s === 'done') {
      return { backgroundColor: 'var(--state-approved-bg)', color: 'var(--state-approved)' };
    }
    if (s === 'en progreso' || s === 'en_progreso') {
      return { backgroundColor: 'var(--state-pending-bg)', color: 'var(--state-pending)' };
    }
    return { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' };
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content about-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Hero Banner */}
        <div className="about-hero-banner">
          <button className="about-close-btn" onClick={onClose} title="Cerrar modal">
            <X size={16} />
          </button>
          <span className="about-hero-logo">✈️</span>
          <h2 className="about-hero-title">Iniciativa Estudiantil UAVUSM</h2>
          <p className="about-hero-subtitle">Innovación y desarrollo tecnológico aeroespacial en la UTFSM</p>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: 'calc(90vh - 170px)', overflowY: 'auto', padding: '2rem' }}>
          
          {/* Section 1: Our Story */}
          <h3 className="about-section-title">
            <BookOpen size={18} />
            <span>Nuestra Historia</span>
          </h3>

          <div className="about-timeline">
            {/* Timeline Item 1 */}
            <div className="about-timeline-item">
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-header">
                <span className="about-timeline-year">2024</span>
                <span className="about-timeline-subtitle">El Origen y la Pasión Autónoma</span>
              </div>
              <p className="about-timeline-content">
                Nacimos en la Universidad Técnica Federico Santa María (Sede San Joaquín, Chile) como un grupo compuesto 100% por estudiantes apasionados por la tecnología aeroespacial. Impulsados por el deseo de llevar a nuestra casa de estudios un espacio dedicado a los Vehículos Aéreos no Tripulados (UAV), decidimos diseñar y construir de forma autodidacta un prototipo VTOL (aeronave de despegue y aterrizaje vertical) impreso completamente en 3D. 
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="about-timeline-item orange-dot">
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-header">
                <span className="about-timeline-year">2025</span>
                <span className="about-timeline-subtitle">Resiliencia y el Primer Prototipo</span>
              </div>
              <p className="about-timeline-content">
                Los primeros meses representaron un gran reto. Con fondos limitados de la universidad, invertimos recursos propios por nuestra firme creencia en el potencial del proyecto. Nuestro primer prototipo VTOL volaba solo un par de minutos, sufría de sobrecalentamiento y sus alas de plástico se ablandaban bajo el sol, pero nos dio el conocimiento base indispensable para seguir adelante. Empezamos a divulgar nuestro trabajo en importantes conferencias como <em>Drones para Chile</em> y <em>Expodron</em>.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="about-timeline-item purple-dot">
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-header">
                <span className="about-timeline-year">2026</span>
                <span className="about-timeline-subtitle">Alianza Estratégica e Impulso Profesional</span>
              </div>
              <p className="about-timeline-content">
                El ecosistema nacional de drones comenzó a expandirse aceleradamente. En uno de nuestros encuentros de vinculación industrial, logramos conectar con la empresa <strong>Skydrone</strong>. Fascinados por el talento e ingenio del equipo estudiantil, decidieron patrocinarnos, convirtiéndose en nuestro pilar de apoyo estratégico, técnico y económico, permitiéndonos proyectar el desarrollo hacia niveles industriales.
              </p>
            </div>
          </div>

          {/* Strategic Alliance Callout */}
          <div className="about-sponsor-card">
            <div className="about-sponsor-logo-box">
              <Award size={24} />
            </div>
            <div className="about-sponsor-text">
              <h4>
                <span>Sponsor Principal: Skydrone</span>
              </h4>
              <p>
                Gracias a la alianza establecida en el año 2026, contamos con mentoría experta y financiamiento para la adquisición de componentes de grado aeroespacial, impulsando significativamente el desarrollo tecnológico del equipo.
              </p>
            </div>
          </div>

          {/* Section 2: Current Projects */}
          <h3 className="about-section-title" style={{ marginTop: '2.5rem' }}>
            <Users size={18} />
            <span>Nuestros 5 Proyectos Activos</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.45' }}>
            Actualmente nos organizamos en células de trabajo multidisciplinarias para sacar adelante las cinco aristas clave de nuestro ecosistema tecnológico actual:
          </p>

          <div className="about-projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => {
                const initials = project.leader_name
                  ? project.leader_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'U';
                
                return (
                  <div className="about-project-card" key={project.id}>
                    <div className="about-project-card-header">
                      <div className="about-project-card-title-area">
                        <span className="about-project-card-icon">
                          {getProjectIcon(project.name)}
                        </span>
                        <span className="about-project-card-title">{project.name}</span>
                      </div>
                    </div>
                    
                    <p className="about-project-card-desc">{project.description}</p>
                    
                    <div className="about-project-card-footer">
                      <div className="about-project-leader">
                        <span className="about-project-leader-avatar" title={`Líder del Proyecto: ${project.leader_name}`}>
                          {initials[0]}
                        </span>
                        <span>{project.leader_name}</span>
                      </div>
                      
                      <span 
                        className="about-project-status"
                        style={getStatusStyle(project.status)}
                      >
                        {project.status || 'Por iniciar'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', gridColumn: '1 / -1' }}>
                Cargando información de los proyectos...
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
