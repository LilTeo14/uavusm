import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Move, Sparkles, Trophy, 
  Calendar, CheckCircle2, Clock, GitMerge, Eye, ChevronRight,
  User, AlertCircle, Layers
} from 'lucide-react';
import { ROADMAP_NODES, ROADMAP_PROJECTS, ROADMAP_PHASES } from '../../data/roadmapGraphData';

// Helper para convertir hex a rgba con opacidad
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

// Coordenadas Y canónicas para cada carril (separación limpia de 120px entre carriles)
const LANE_Y = {
  copter: 90,
  dock: 210,
  convergence: 330,
  remote: 450,
  vtol: 570,
  fondo: 690,
  pista: 810
};

// Definición de carriles con paleta rica de colores y subtítulos
const LANE_DEFINITIONS = [
  { id: 'copter', name: 'Skycopter', icon: '🚁', y: LANE_Y.copter, color: '#0ea5e9', lightColor: '#38bdf8', subtitle: 'Dron Autónomo' },
  { id: 'dock', name: 'Skydock', icon: '⚙️', y: LANE_Y.dock, color: '#10b981', lightColor: '#34d399', subtitle: 'Estación Carga' },
  { id: 'convergence', name: 'Convergencia', icon: '⚡', y: LANE_Y.convergence, isConvergence: true, color: '#a855f7', lightColor: '#c084fc', subtitle: 'Grandes Hitos' },
  { id: 'remote', name: 'Sky Remote', icon: '💻', y: LANE_Y.remote, color: '#8b5cf6', lightColor: '#a78bfa', subtitle: 'Telemetría & UI' },
  { id: 'vtol', name: 'SkyVTOL', icon: '📐', y: LANE_Y.vtol, color: '#ec4899', lightColor: '#f472b6', subtitle: 'Aeronave VTOL' },
  { id: 'fondo', name: 'Concurso Fondo USM', icon: '🎓', y: LANE_Y.fondo, color: '#eab308', lightColor: '#fde047', subtitle: 'Fondos & Pitch' },
  { id: 'pista', name: 'Pista Carreras', icon: '🏁', y: LANE_Y.pista, color: '#14b8a6', lightColor: '#2dd4bf', subtitle: 'Circuito FPV' }
];

export default function DependencyGraphCanvas({ 
  selectedProjectId = 'all',
  onSelectNode,
  selectedNodeId
}) {
  const containerRef = useRef(null);
  
  // Transformación del lienzo (Pan & Zoom)
  const [zoom, setZoom] = useState(0.88);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Nodo con cursor encima (Hover para resaltar enlaces)
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Dimensiones del lienzo virtual calibradas para visualización perfecta sin recorte de texto
  const CANVAS_WIDTH = 4550;
  const CANVAS_HEIGHT = 960;
  const COL_STEP = 260; // 260px por columna garantiza 64px de holgura libre entre tarjetas
  const NODE_WIDTH = 196;
  const NODE_HEIGHT = 86; // Altura generosa para acomodar título completo sin cortar texto
  const SIDEBAR_OFFSET = 240; // Espacio inicial tras la barra fija

  // Mapa de coordenadas fijas para cada nodo
  const nodePositions = useMemo(() => {
    const colToX = (col) => {
      return SIDEBAR_OFFSET + (col - 1) * COL_STEP;
    };

    const laneToY = (lane) => {
      if (lane === 1) return LANE_Y.copter;
      if (lane === 2) return LANE_Y.dock;
      if (lane === 2.5) return LANE_Y.convergence;
      if (lane === 3) return LANE_Y.remote;
      if (lane === 4) return LANE_Y.vtol;
      if (lane === 5) return LANE_Y.fondo;
      if (lane === 6) return LANE_Y.pista;
      return 100 + lane * 120;
    };

    const positions = {};
    ROADMAP_NODES.forEach(node => {
      positions[node.id] = {
        x: colToX(node.col),
        y: laneToY(node.lane),
        width: node.isMajorMilestone ? 230 : NODE_WIDTH,
        height: node.isMajorMilestone ? 96 : NODE_HEIGHT
      };
    });
    return positions;
  }, []);

  // Lista de todas las conexiones (Edges) con colores por proyecto de origen y destino
  const edges = useMemo(() => {
    const edgeList = [];
    ROADMAP_NODES.forEach(node => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach(prereqId => {
          const fromPos = nodePositions[prereqId];
          const toPos = nodePositions[node.id];
          const fromNode = ROADMAP_NODES.find(n => n.id === prereqId);
          const fromProj = ROADMAP_PROJECTS.find(p => p.id === fromNode?.projectId);
          const toProj = ROADMAP_PROJECTS.find(p => p.id === node.projectId);

          if (fromPos && toPos) {
            edgeList.push({
              id: `${prereqId}->${node.id}`,
              fromId: prereqId,
              toId: node.id,
              fromX: fromPos.x + fromPos.width,
              fromY: fromPos.y + fromPos.height / 2,
              toX: toPos.x,
              toY: toPos.y + toPos.height / 2,
              isCrossLane: Math.abs(fromPos.y - toPos.y) > 20,
              fromColor: fromProj?.lightColor || fromProj?.color || '#38bdf8',
              toColor: toProj?.lightColor || toProj?.color || '#a855f7',
              fromProjId: fromProj?.id || 'default'
            });
          }
        });
      }
    });
    return edgeList;
  }, [nodePositions]);

  // Nodos activos/resaltados según selección o hover
  const activeFocusId = selectedNodeId || hoveredNodeId;

  const highlightedEdgeIds = useMemo(() => {
    if (!activeFocusId) return new Set();
    const activeNode = ROADMAP_NODES.find(n => n.id === activeFocusId);
    if (!activeNode) return new Set();

    const set = new Set();
    (activeNode.prerequisites || []).forEach(pId => set.add(`${pId}->${activeNode.id}`));
    (activeNode.unlocks || []).forEach(uId => set.add(`${activeNode.id}->${uId}`));
    return set;
  }, [activeFocusId]);

  // Control de rebote elástico (rubber-band)
  const [isBouncingBack, setIsBouncingBack] = useState(false);

  // Límites naturales del lienzo:
  // - En X: el inicio de la fase 1 (230px) no puede desplazarse a la derecha de la barra lateral (215px)
  // - En Y: la primera rama de trabajo (lane copter y=90) no puede desplazarse hacia abajo de la barra superior (44px)
  const getPanLimits = () => {
    // Si el inicio de la fase 1 está en x=230px del canvas, su posición en pantalla es pan.x + 230 * zoom.
    // Para que no se desplace más allá del inicio de la fase 1 (pegada al sidebar de 215px):
    // pan.x + 230 * zoom <= 215  =>  maxPanX = 215 - 230 * zoom. (Aproximadamente 0 a zoom 0.9)
    // Nos aseguramos de que maxPanX <= 0
    const maxPanX = Math.min(0, 215 - (230 * zoom));
    
    // Para la primera rama de trabajo (Skycopter y=90px, carril centrado verticalmente ~35-73px):
    // Al desplazar hacia abajo (pan.y > 0), no queremos que la primera rama baje más allá de su origen natural
    // maxPanY = 0 evita que el carril superior caiga dejando un vacío negro arriba.
    const maxPanY = 0;

    return { maxPanX, maxPanY };
  };

  // Función para aplicar resistencia elástica (rubber-banding exponencial)
  const applyRubberBand = (val, maxVal, overscrollLimit = 160) => {
    if (val <= maxVal) return val;
    const overscroll = val - maxVal;
    // Curva asintótica de frenado: se va poniendo cada vez más dura
    return maxVal + overscrollLimit * (1 - Math.exp(-overscroll / (overscrollLimit * 1.5)));
  };

  // Manejo de Drag-to-Pan
  const handleMouseDown = (e) => {
    if (
      e.target.closest('.roadmap-node-box') || 
      e.target.closest('.canvas-controls-bar') || 
      e.target.closest('.canvas-frozen-sidebar') ||
      e.target.closest('.canvas-frozen-topbar')
    ) return;
    setIsBouncingBack(false);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, initialPanX: pan.x, initialPanY: pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const rawPanX = dragStart.initialPanX + deltaX;
    const rawPanY = dragStart.initialPanY + deltaY;

    const { maxPanX, maxPanY } = getPanLimits();

    const boundedX = applyRubberBand(rawPanX, maxPanX, 130);
    const boundedY = applyRubberBand(rawPanY, maxPanY, 80);

    setPan({
      x: boundedX,
      y: boundedY
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { maxPanX, maxPanY } = getPanLimits();
    const needsSnapX = pan.x > maxPanX;
    const needsSnapY = pan.y > maxPanY;

    if (needsSnapX || needsSnapY) {
      setIsBouncingBack(true);
      setPan({
        x: needsSnapX ? maxPanX : pan.x,
        y: needsSnapY ? maxPanY : pan.y
      });
      setTimeout(() => {
        setIsBouncingBack(false);
      }, 420);
    }
  };

  const TODAY_CANVAS_X = 2570;

  // Centrar o posicionar en un punto X del lienzo con una posición visual fraccionaria (ej: 1/3 del ancho)
  const alignCanvasToX = (targetCanvasX, ratio = 1 / 3, targetZoom = zoom) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const newPanX = (containerWidth * ratio) - (targetCanvasX * targetZoom);
    const maxPanX = Math.min(0, 215 - (230 * targetZoom));
    setZoom(targetZoom);
    setPan({ x: Math.min(maxPanX, newPanX), y: 0 });
  };

  // Posicionar al entrar a la página: la franja azul claro de "Hoy" a 1/3 del ancho total de la ventana
  useEffect(() => {
    const timer = setTimeout(() => {
      alignCanvasToX(TODAY_CANVAS_X, 1 / 3, 0.88);
    }, 50);

    const handleResize = () => {
      // Si la ventana cambia de tamaño al inicio
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manejo de rueda del mouse (Wheel):
  // - Sobre la barra lateral (Ramas de desarrollo): hace scroll vertical exclusivo de las ramas/lienzo (pan.y)
  // - Sobre el lienzo del mapa: hace zoom in/out suave centrado en la posición del puntero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Prevenir el scroll por defecto de la página para que no se desplace el header/ventana
      e.preventDefault();

      const isOverSidebar = e.target.closest('.canvas-frozen-sidebar');

      if (isOverSidebar) {
        // Scroll vertical exclusivo de la barra lateral (y del mapa en sincronía Y)
        const scrollDelta = e.deltaY;
        setPan(prevPan => {
          const containerHeight = container.clientHeight || 640;
          const minPanY = Math.min(0, containerHeight - (CANVAS_HEIGHT * zoom + 60));
          const maxPanY = 0;
          const newY = Math.min(maxPanY, Math.max(minPanY, prevPan.y - scrollDelta));
          return {
            ...prevPan,
            y: newY
          };
        });
      } else {
        // Zoom in/out sobre el lienzo del mapa enfocado hacia la posición del cursor
        const zoomFactor = e.deltaY < 0 ? 1.09 : 0.91;
        setZoom(prevZoom => {
          const newZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.45), 1.5);
          if (newZoom === prevZoom) return prevZoom;

          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          setPan(prevPan => {
            const { maxPanX, maxPanY } = getPanLimits();
            const newPanX = mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom);
            const newPanY = mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom);
            return {
              x: Math.min(maxPanX, newPanX),
              y: Math.min(maxPanY, newPanY)
            };
          });

          return newZoom;
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.12, 1.4));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.12, 0.45));
  const handleReset = () => {
    alignCanvasToX(TODAY_CANVAS_X, 1 / 3, 0.88);
  };

  // Botones de Salto Rápido por Fases
  const jumpToPhase = (phaseX, targetZoom = 0.92, ratio = 0.5) => {
    alignCanvasToX(phaseX, ratio, targetZoom);
  };

  // Estilo de transición cuando rebota al límite
  const snapTransition = isBouncingBack ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none';

  return (
    <div className="graph-canvas-outer">
      {/* BARRA SUPERIOR DE CONTROL INTERACTIVO */}
      <div className="canvas-controls-bar">
        {/* Botones de Salto Rápido */}
        <div className="quick-jump-group">
          <span className="controls-label">
            <Eye size={13} /> Saltar a:
          </span>
          <button 
            onClick={() => jumpToPhase(900, 0.88)} 
            className="btn-jump-pill"
            title="Ir a los preparativos y culminación de la Expo Seguridad"
          >
            🏆 Expo Seguridad
          </button>
          <button 
            onClick={() => jumpToPhase(TODAY_CANVAS_X, 0.88, 1 / 3)} 
            className="btn-jump-pill pill-today"
            title="Centrar en las actividades de Hoy (10 de Septiembre en adelante) a 1/3 de la ventana"
          >
            <span className="pulse-dot-small"></span>
            ⚡ Hoy (Calibración)
          </button>
          <button 
            onClick={() => jumpToPhase(3650, 0.95)} 
            className="btn-jump-pill"
            title="Ir a las pruebas en Cancha y Demostración Universitaria"
          >
            🏟️ Cancha & Gran Demo
          </button>
          <button 
            onClick={() => jumpToPhase(4150, 0.88)} 
            className="btn-jump-pill"
            title="Ir al horizonte 2027"
          >
            🔭 Cierre 2027
          </button>
          <button 
            onClick={() => jumpToPhase(2200, 0.48)} 
            className="btn-jump-pill pill-fit"
            title="Ajustar vista general para ver todo en pantalla"
          >
            Ver Todo
          </button>
        </div>

        {/* Controles de Zoom & Arrastre */}
        <div className="zoom-controls-group">
          <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="btn-zoom" title="Acercar (+)">
            <ZoomIn size={14} />
          </button>
          <button onClick={handleZoomOut} className="btn-zoom" title="Alejar (-)">
            <ZoomOut size={14} />
          </button>
          <button onClick={handleReset} className="btn-zoom" title="Restablecer">
            <RotateCcw size={13} />
          </button>
          <div className="pan-hint">
            <Move size={12} />
            <span>Arrastra para moverte</span>
          </div>
        </div>
      </div>

      {/* ÁREA INTERACTIVA DEL LIENZO (VIEWPORT) */}
      <div 
        ref={containerRef}
        className={`graph-viewport ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* =============================================================
            BARRA FIJA SUPERIOR (FROZEN / STICKY PHASE & TIMELINE HEADERS)
            Permanente siempre arriba en el lienzo, sincronizada horizontalmente
           ============================================================= */}
        <div className="canvas-frozen-topbar">
          <div 
            className="frozen-phases-track"
            style={{
              transform: `translateX(${pan.x}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: snapTransition
            }}
          >
            {/* Zona 1: Expo Seguridad */}
            <div className="frozen-phase-badge badge-expo" style={{ left: 230, width: 2330 }}>
              <span className="frozen-phase-tag">✓ FASE 1: CUMPLIDA CON ÉXITO</span>
              <strong className="frozen-phase-title">🏆 Expo Seguridad 2026 (Ago 25 - Sep 10)</strong>
            </div>

            {/* Marcador Luminoso de HOY (Sep 10) */}
            <div className="frozen-today-badge" style={{ left: 2570 }}>
              <span className="pulse-dot-small"></span>
              <span>HOY &bull; 10 SEP 2026</span>
            </div>

            {/* Zona 2: Calibración Activa */}
            <div className="frozen-phase-badge badge-calib" style={{ left: 2560, width: 1030 }}>
              <span className="frozen-phase-tag tag-active">⚡ FASE 2: EN CURSO ACTIVO</span>
              <strong className="frozen-phase-title">Calibración Activa & Puesta a Punto (Sep 11 - Oct 15)</strong>
            </div>

            {/* Zona 3: Cancha & Gran Demo USM */}
            <div className="frozen-phase-badge badge-demo" style={{ left: 3590, width: 520 }}>
              <span className="frozen-phase-tag tag-target">🏟️ FASE 3: PRÓXIMO HITO FARO</span>
              <strong className="frozen-phase-title">Ensayos Cancha & Gran Demo USM (Octubre TBD)</strong>
            </div>

            {/* Zona 4: Cierre 2027 */}
            <div className="frozen-phase-badge badge-future" style={{ left: 4110, width: 400 }}>
              <span className="frozen-phase-tag">🔭 FASE 4: HORIZONTE</span>
              <strong className="frozen-phase-title">Cierre Ciclo 2027</strong>
            </div>
          </div>
        </div>

        {/* =============================================================
            SIDEBAR FIJA A LA IZQUIERDA (FROZEN / STICKY LANE HEADERS)
            Permanente siempre a la izquierda, con badges de color por proyecto
           ============================================================= */}
        <div className="canvas-frozen-sidebar">
          <div className="frozen-sidebar-header">
            <Layers size={13} style={{ color: '#38bdf8' }} />
            <span>Ramas de Desarrollo</span>
          </div>
          <div 
            className="frozen-lanes-track"
            style={{
              transform: `translateY(${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: snapTransition
            }}
          >
            {LANE_DEFINITIONS.map(lane => (
              <div 
                key={lane.id} 
                className={`frozen-lane-item ${lane.isConvergence ? 'is-convergence' : ''}`}
                style={{ 
                  top: `${lane.y + (NODE_HEIGHT - 56) / 2}px`,
                  height: '56px',
                  borderLeft: `4px solid ${lane.color}`,
                  background: lane.isConvergence
                    ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.35) 0%, rgba(30, 27, 75, 0.96) 100%)'
                    : `linear-gradient(135deg, ${hexToRgba(lane.color, 0.22)} 0%, rgba(15, 23, 42, 0.96) 100%)`,
                  borderColor: hexToRgba(lane.color, 0.38)
                }}
              >
                <span 
                  className="frozen-lane-icon-box"
                  style={{
                    background: hexToRgba(lane.color, 0.25),
                    borderColor: hexToRgba(lane.color, 0.5)
                  }}
                >
                  {lane.icon}
                </span>
                <div className="frozen-lane-info">
                  <strong style={{ color: lane.lightColor || '#f8fafc' }}>{lane.name}</strong>
                  <span className="frozen-lane-sub">{lane.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =============================================================
            LIENZO MÓVIL (PAN & ZOOM CON TODAS LAS TAREAS Y CONEXIONES)
           ============================================================= */}
        <div 
          className="graph-canvas-plane"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            transition: snapTransition
          }}
        >
          {/* =============================================================
              CAPA 0: CARRILES HORIZONTALES (SWIMLANES CON IDENTIDAD VISUAL)
             ============================================================= */}
          <div className="canvas-swimlanes-layer">
            {LANE_DEFINITIONS.map(lane => (
              <div 
                key={`swimlane-${lane.id}`}
                className={`canvas-swimlane-band ${lane.isConvergence ? 'is-convergence' : ''}`}
                style={{
                  top: `${lane.y - 17}px`,
                  height: '120px',
                  backgroundColor: lane.isConvergence 
                    ? 'rgba(168, 85, 247, 0.05)' 
                    : hexToRgba(lane.color, 0.035),
                  borderBottom: `1px dashed ${hexToRgba(lane.color, 0.2)}`
                }}
              >
                <div className="swimlane-watermark" style={{ color: lane.color }}>
                  <span className="swimlane-icon">{lane.icon}</span>
                  <span className="swimlane-label">{lane.name.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* =============================================================
              CAPA 1: COLUMNAS DE TIEMPO & ZONAS DE FASE DE FONDO
             ============================================================= */}
          <div className="canvas-phase-backgrounds">
            {/* Zona 1: Expo Seguridad (Col 1 a 9) */}
            <div className="phase-zone-bg zone-expo" style={{ left: 230, width: 2330 }}></div>

            {/* Marcador Luminoso de HOY (Sep 10) - Línea guía vertical que atraviesa el lienzo */}
            <div className="today-canvas-marker" style={{ left: 2570 }}>
              <div className="today-marker-line"></div>
            </div>

            {/* Zona 2: Calibración Activa (Col 10 a 13) */}
            <div className="phase-zone-bg zone-calib" style={{ left: 2560, width: 1030 }}></div>

            {/* Zona 3: Cancha & Gran Demo USM (Col 14 a 15) */}
            <div className="phase-zone-bg zone-demo" style={{ left: 3590, width: 520 }}></div>

            {/* Zona 4: Cierre 2027 (Col 16) */}
            <div className="phase-zone-bg zone-future" style={{ left: 4110, width: 400 }}></div>
          </div>

          {/* =============================================================
              CAPA 2: CURVAS SVG DE DEPENDENCIAS (LÍNEAS COLORIDAS BÉZIER)
             ============================================================= */}
          <svg className="canvas-svg-edges-layer" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <defs>
              <marker 
                id="arrow-default" 
                viewBox="0 0 10 10" 
                refX="7" 
                refY="5" 
                markerWidth="6" 
                markerHeight="6" 
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgba(148, 163, 184, 0.6)" />
              </marker>

              {/* Flechas específicas por color de cada proyecto */}
              {ROADMAP_PROJECTS.map(proj => (
                <marker
                  key={`arrow-${proj.id}`}
                  id={`arrow-${proj.id}`}
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={proj.lightColor || proj.color} />
                </marker>
              ))}

              <marker 
                id="arrow-incoming" 
                viewBox="0 0 10 10" 
                refX="7" 
                refY="5" 
                markerWidth="7.5" 
                markerHeight="7.5" 
                orient="auto"
              >
                <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#38bdf8" />
              </marker>

              <marker 
                id="arrow-outgoing" 
                viewBox="0 0 10 10" 
                refX="7" 
                refY="5" 
                markerWidth="7.5" 
                markerHeight="7.5" 
                orient="auto"
              >
                <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#f472b6" />
              </marker>

              {/* Gradientes para enlaces entre proyectos */}
              {edges.filter(e => e.isCrossLane).map(edge => (
                <linearGradient 
                  key={`grad-${edge.id}`} 
                  id={`grad-${edge.id}`} 
                  x1="0%" 
                  y1="0%" 
                  x2="100%" 
                  y2="0%"
                >
                  <stop offset="0%" stopColor={edge.fromColor} />
                  <stop offset="100%" stopColor={edge.toColor} />
                </linearGradient>
              ))}
            </defs>

            {edges.map(edge => {
              const isHighlighted = highlightedEdgeIds.has(edge.id);
              const hasActiveFocus = !!activeFocusId;
              const isOutgoing = activeFocusId && edge.fromId === activeFocusId;
              const isIncoming = activeFocusId && edge.toId === activeFocusId;

              // Curvatura suave con delta horizontal generoso (mínimo 40px)
              const dx = Math.max(Math.abs(edge.toX - edge.fromX) * 0.45, 40);
              const pathD = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX + dx} ${edge.fromY}, ${edge.toX - dx} ${edge.toY}, ${edge.toX} ${edge.toY}`;

              let strokeColor = edge.isCrossLane ? `url(#grad-${edge.id})` : edge.fromColor;
              let strokeWidth = edge.isCrossLane ? 2.4 : 2.0;
              let marker = `url(#arrow-${edge.fromProjId})`;
              let opacity = 0.78;

              if (hasActiveFocus) {
                if (isIncoming) {
                  strokeColor = '#38bdf8';
                  strokeWidth = 3.5;
                  marker = 'url(#arrow-incoming)';
                  opacity = 1;
                } else if (isOutgoing) {
                  strokeColor = '#f472b6';
                  strokeWidth = 3.5;
                  marker = 'url(#arrow-outgoing)';
                  opacity = 1;
                } else {
                  strokeColor = 'rgba(148, 163, 184, 0.1)';
                  strokeWidth = 1;
                  opacity = 0.2;
                }
              }

              return (
                <path
                  key={edge.id}
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  style={{ opacity }}
                  className={`edge-path ${isHighlighted ? 'edge-highlighted' : ''} ${edge.isCrossLane ? 'edge-cross-lane' : ''}`}
                />
              );
            })}
          </svg>

          {/* =============================================================
              CAPA 3: NODOS INTERACTIVOS (TARJETAS VIBRANTES EN EL GRAFO)
             ============================================================= */}
          <div className="canvas-nodes-layer">
            {ROADMAP_NODES.map(node => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const project = ROADMAP_PROJECTS.find(p => p.id === node.projectId) || {
                color: '#0ea5e9', lightColor: '#38bdf8', icon: '🔹', name: 'General'
              };

              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isHighlighted = isSelected || isHovered;
              const isDimmedByFilter = selectedProjectId !== 'all' && node.projectId !== selectedProjectId && !node.isMajorMilestone;

              const projColor = project.color;
              const projLight = project.lightColor || project.color;

              let cardBg = `linear-gradient(145deg, ${hexToRgba(projColor, 0.24)} 0%, rgba(15, 23, 42, 0.94) 100%)`;
              let cardBorder = `1.5px solid ${hexToRgba(projColor, isHighlighted ? 1 : 0.48)}`;
              let cardBoxShadow = isHighlighted
                ? `0 0 24px ${hexToRgba(projLight, 0.7)}, 0 8px 24px rgba(0, 0, 0, 0.55)`
                : `0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 ${hexToRgba(projLight, 0.22)}`;

              if (node.isMajorMilestone) {
                cardBg = 'linear-gradient(135deg, rgba(147, 51, 234, 0.45) 0%, rgba(219, 39, 119, 0.32) 50%, rgba(15, 23, 42, 0.96) 100%)';
                cardBorder = '2px solid #c084fc';
                cardBoxShadow = isHighlighted
                  ? '0 0 32px rgba(168, 85, 247, 0.85), 0 10px 30px rgba(0, 0, 0, 0.6)'
                  : '0 0 22px rgba(168, 85, 247, 0.4), 0 6px 18px rgba(0, 0, 0, 0.5)';
              }

              return (
                <div
                  key={node.id}
                  id={`node-${node.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`roadmap-node-box ${node.isMajorMilestone ? 'node-major-milestone' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${isDimmedByFilter ? 'is-dimmed' : ''}`}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: cardBoxShadow
                  }}
                >
                  <div className="node-box-inner">
                    {/* Fila superior: Chip de proyecto/tag y estado con color */}
                    <div className="node-box-header">
                      <span 
                        className="node-proj-pill" 
                        style={{ 
                          background: hexToRgba(projColor, 0.28), 
                          color: projLight,
                          borderColor: hexToRgba(projColor, 0.5)
                        }}
                      >
                        <span>{project.icon}</span>
                        <span>{node.tag || project.name}</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {node.status === 'done' && (
                          <span className="node-status-chip chip-done" title="Completado con éxito">
                            <CheckCircle2 size={11} /> Listo
                          </span>
                        )}
                        {node.status === 'in_progress' && (
                          <span className="node-status-chip chip-active" title="En desarrollo activo">
                            <span className="pulse-dot-small active-dot" /> En curso
                          </span>
                        )}
                        {node.status === 'planned' && (
                          <span className="node-status-chip chip-planned" title="Planificado">
                            <Clock size={10} /> Plan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Título de la tarea */}
                    <h5 className="node-box-title" title={node.title}>
                      {node.title}
                    </h5>

                    {/* Fila inferior: Líder (si existe o Sin asignar) y dependencias */}
                    <div className="node-box-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflow: 'hidden' }}>
                        {node.leaders ? (
                          <span className="node-leader-badge" title={`Responsable(s): ${node.leaders}`}>
                            <User size={10} />
                            <span>{node.leaders}</span>
                          </span>
                        ) : (
                          <span className="node-leader-unassigned-pill" title="Sin asignar: por definir por Mateo">
                            <AlertCircle size={9} />
                            <span>Sin asignar</span>
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                        <span className="node-date-tag">{node.shortDate}</span>
                        {(node.prerequisites || []).length > 0 && (
                          <span 
                            className="node-deps-badge" 
                            style={{ color: projLight }} 
                            title={`Requiere ${node.prerequisites.length} prerrequisito(s)`}
                          >
                            <GitMerge size={10} />
                            {node.prerequisites.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
