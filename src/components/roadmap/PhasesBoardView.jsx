import React from 'react';
import { 
  CheckCircle2, Clock, Calendar, Sparkles, ArrowRight, 
  GitMerge, User, ShieldCheck, Flag, Check, AlertCircle
} from 'lucide-react';
import { ROADMAP_PHASES, ROADMAP_NODES, ROADMAP_PROJECTS } from '../../data/roadmapGraphData';

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

export default function PhasesBoardView({ 
  selectedProjectId = 'all', 
  onSelectNode 
}) {
  const filteredNodes = ROADMAP_NODES.filter(node => {
    if (selectedProjectId === 'all') return true;
    return node.projectId === selectedProjectId;
  });

  return (
    <div className="phases-board-container">
      <div className="phases-board-grid">
        {ROADMAP_PHASES.map((phase, idx) => {
          const phaseNodes = filteredNodes.filter(n => n.phase === phase.id);
          const completedCount = phaseNodes.filter(n => n.status === 'done').length;
          const totalCount = phaseNodes.length;
          const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div key={phase.id} className={`phase-column phase-${phase.status}`}>
              {/* Header de Columna */}
              <div className="phase-column-header">
                <div className="phase-badge-row">
                  <span className={`phase-pill phase-pill-${phase.status}`}>
                    {phase.badge}
                  </span>
                  <span className="phase-count-badge">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                
                <h3 className="phase-title">{phase.name}</h3>
                <span className="phase-dates">{phase.dateLabel}</span>
                <p className="phase-desc">{phase.description}</p>

                {/* Barra de Progreso de la Fase */}
                <div className="phase-progress-track">
                  <div 
                    className="phase-progress-bar"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: phase.status === 'completed' ? '#10b981' : phase.status === 'active' ? '#0ea5e9' : '#a855f7'
                    }}
                  />
                </div>
              </div>

              {/* Lista de Tarjetas de Nodos con Color y Contraste */}
              <div className="phase-cards-list">
                {phaseNodes.length === 0 ? (
                  <div className="phase-empty-state">
                    <span>No hay tareas en esta fase para el filtro seleccionado.</span>
                  </div>
                ) : (
                  phaseNodes.map(node => {
                    const project = ROADMAP_PROJECTS.find(p => p.id === node.projectId) || {
                      name: 'General', icon: '🔹', color: '#0ea5e9', lightColor: '#38bdf8'
                    };
                    const prereqCount = (node.prerequisites || []).length;
                    const unlockCount = (node.unlocks || []).length;
                    const projColor = project.color;
                    const projLight = project.lightColor || project.color;

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`phase-node-card ${node.isMajorMilestone ? 'card-major-milestone' : ''} status-${node.status}`}
                        style={{ 
                          borderLeft: `4px solid ${projColor}`,
                          borderColor: hexToRgba(projColor, 0.38),
                          background: node.isMajorMilestone
                            ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.35) 0%, rgba(30, 27, 75, 0.95) 100%)'
                            : `linear-gradient(145deg, ${hexToRgba(projColor, 0.18)} 0%, rgba(15, 23, 42, 0.94) 100%)`
                        }}
                      >
                        <div className="card-top-row">
                          <span 
                            className="card-proj-badge" 
                            style={{ 
                              background: hexToRgba(projColor, 0.25),
                              color: projLight,
                              borderColor: hexToRgba(projColor, 0.45)
                            }}
                          >
                            <span>{project.icon}</span>
                            <span>{project.name}</span>
                          </span>
                          <span className="card-date-badge">{node.shortDate}</span>
                        </div>

                        <h4 className="card-title">{node.title}</h4>

                        <div className="card-leader-row">
                          <User size={12} />
                          {node.leaders ? (
                            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{node.leaders}</span>
                          ) : (
                            <span className="node-leader-unassigned-pill">
                              <AlertCircle size={9} /> Sin asignar
                            </span>
                          )}
                        </div>

                        {/* Badges de Dependencias Explícitas */}
                        <div className="card-dependencies-row">
                          {prereqCount > 0 ? (
                            <span className="dep-badge dep-in" title={`Depende de ${prereqCount} tarea(s)`}>
                              <GitMerge size={11} />
                              <span>{prereqCount} prereq.</span>
                            </span>
                          ) : (
                            <span className="dep-badge dep-root" title="Tarea inicial">
                              <span>⚡ Inicial</span>
                            </span>
                          )}

                          {unlockCount > 0 && (
                            <span className="dep-badge dep-out" title={`Habilita ${unlockCount} tarea(s)`}>
                              <ArrowRight size={11} />
                              <span>{unlockCount} desbloquea</span>
                            </span>
                          )}

                          {node.status === 'done' ? (
                            <span className="node-status-chip chip-done">
                              <CheckCircle2 size={11} /> Listo
                            </span>
                          ) : node.status === 'in_progress' ? (
                            <span className="node-status-chip chip-active">
                              <span className="pulse-dot-small active-dot" /> En curso
                            </span>
                          ) : (
                            <span className="node-status-chip chip-planned">
                              <Calendar size={11} /> Plan
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
