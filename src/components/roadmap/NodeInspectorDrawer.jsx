import React, { useEffect } from 'react';
import { 
  X, CheckCircle2, Clock, Calendar, User, ArrowRight, 
  Layers, Link2, Sparkles, AlertCircle, GitMerge, ExternalLink
} from 'lucide-react';
import { ROADMAP_NODES, ROADMAP_PROJECTS } from '../../data/roadmapGraphData';

function hexToRgba(hex, alpha = 1) {
  if (!hex || !hex.startsWith('#')) return `rgba(14, 165, 233, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function NodeInspectorDrawer({ 
  nodeId, 
  onClose, 
  onSelectNode,
  onNavigateToProject
}) {
  const node = ROADMAP_NODES.find(n => n.id === nodeId);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const project = ROADMAP_PROJECTS.find(p => p.id === node.projectId) || {
    name: 'Convergencia', icon: '🌐', color: '#a855f7', lightColor: '#c084fc'
  };

  const prerequisiteNodes = (node.prerequisites || []).map(id => ROADMAP_NODES.find(n => n.id === id)).filter(Boolean);
  const unlockedNodes = (node.unlocks || []).map(id => ROADMAP_NODES.find(n => n.id === id)).filter(Boolean);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return <span className="status-badge status-done"><CheckCircle2 size={13} /> Entregado / Cumplido</span>;
      case 'in_progress':
        return <span className="status-badge status-active"><Clock size={13} /> En curso activo</span>;
      case 'planned':
        return <span className="status-badge status-planned"><Calendar size={13} /> Planificado</span>;
      default:
        return <span className="status-badge status-planned">{status}</span>;
    }
  };

  return (
    <div className="inspector-drawer-backdrop" onClick={onClose}>
      <div 
        className="inspector-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `4px solid ${project.color || 'var(--accent-primary)'}` }}
      >
        {/* Cabecera del Inspector con fondo sutil del proyecto */}
        <div 
          className="inspector-header"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(project.color, 0.14)} 0%, rgba(255, 255, 255, 0.01) 100%)`
          }}
        >
          <div className="inspector-header-top">
            <div className="inspector-project-tag" style={{ color: project.lightColor || project.color }}>
              <span className="project-icon">{project.icon}</span>
              <span className="project-name">{project.name}</span>
              <span className="tag-separator">•</span>
              <span className="node-category">{node.tag || 'Actividad'}</span>
            </div>
            <button 
              onClick={onClose} 
              className="btn-icon-close" 
              title="Cerrar detalles (Esc)"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className="inspector-node-title">{node.title}</h3>
          
          <div className="inspector-meta-row">
            {getStatusBadge(node.status)}
            <span className="inspector-date-chip">
              <Calendar size={13} /> {node.shortDate}
            </span>
            {node.isMajorMilestone && (
              <span className="inspector-milestone-chip">
                <Sparkles size={13} /> Hito Mayor
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo del Inspector */}
        <div className="inspector-body">
          {/* Responsables */}
          <div className="inspector-section">
            <h4 className="section-title">
              <User size={14} /> Responsable(s)
            </h4>
            <div className="inspector-leaders-box">
              {node.leaders ? (
                <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>{node.leaders}</strong>
              ) : (
                <span className="node-leader-unassigned-pill" style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem' }}>
                  <AlertCircle size={13} /> Sin asignar (Por definir por Mateo)
                </span>
              )}
            </div>
          </div>

          {/* Contexto y Relato */}
          <div className="inspector-section">
            <h4 className="section-title">
              <Layers size={14} /> Contexto & Detalle Técnico
            </h4>
            <p className="inspector-description">{node.description}</p>
          </div>

          {/* Prerrequisitos (¿De qué depende?) */}
          <div className="inspector-section">
            <h4 className="section-title text-prereq">
              <GitMerge size={14} /> ¿De qué depende esta tarea? ({prerequisiteNodes.length})
            </h4>
            {prerequisiteNodes.length === 0 ? (
              <div className="empty-dependency-hint">
                <span>⚡ Tarea inicial autónoma. No requiere hitos previos.</span>
              </div>
            ) : (
              <div className="dependency-chips-list">
                {prerequisiteNodes.map(prereq => {
                  const prereqProj = ROADMAP_PROJECTS.find(p => p.id === prereq.projectId);
                  return (
                    <button
                      key={prereq.id}
                      onClick={() => onSelectNode(prereq.id)}
                      className={`dependency-chip-card ${prereq.status === 'done' ? 'chip-done' : 'chip-pending'}`}
                      title={`Ir a: ${prereq.title}`}
                    >
                      <div className="chip-left">
                        <span className="chip-proj-icon">{prereqProj?.icon || '🔹'}</span>
                        <div className="chip-text">
                          <strong className="chip-title">{prereq.title}</strong>
                          <span className="chip-sub">{prereqProj?.name} &bull; {prereq.shortDate}</span>
                        </div>
                      </div>
                      <span className="chip-badge">
                        {prereq.status === 'done' ? 'Listo ✓' : 'Pendiente'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sucesores (¿Qué desbloquea?) */}
          <div className="inspector-section">
            <h4 className="section-title text-unlock">
              <Link2 size={14} /> ¿Qué desbloquea a continuación? ({unlockedNodes.length})
            </h4>
            {unlockedNodes.length === 0 ? (
              <div className="empty-dependency-hint">
                <span>🎯 Hito final de su ciclo o entrega de fase.</span>
              </div>
            ) : (
              <div className="dependency-chips-list">
                {unlockedNodes.map(unlock => {
                  const unlockProj = ROADMAP_PROJECTS.find(p => p.id === unlock.projectId);
                  return (
                    <button
                      key={unlock.id}
                      onClick={() => onSelectNode(unlock.id)}
                      className={`dependency-chip-card ${unlock.status === 'done' ? 'chip-done' : 'chip-pending'}`}
                      title={`Ir a: ${unlock.title}`}
                    >
                      <div className="chip-left">
                        <span className="chip-proj-icon">{unlockProj?.icon || '🔹'}</span>
                        <div className="chip-text">
                          <strong className="chip-title">{unlock.title}</strong>
                          <span className="chip-sub">{unlockProj?.name} &bull; {unlock.shortDate}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="chip-arrow" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="inspector-footer">
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Cerrar
          </button>
          {onNavigateToProject && (
            <button
              onClick={() => onNavigateToProject(node.projectId)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Ver {project.name}</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
