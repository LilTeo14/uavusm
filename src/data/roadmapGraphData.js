/**
 * Estructura de Datos del Árbol Evolutivo y Grafo de Dependencias UAVUSM
 * Mapea las relaciones reales entre proyectos (Skycopter, Skydock, Sky Remote, SkyVTOL, etc.),
 * sus prerrequisitos y su convergencia hacia los grandes hitos.
 * REGLA ESTRICTA: NO inventar integrantes ni tareas que el usuario no haya definido.
 */

export const ROADMAP_PHASES = [
  {
    id: 'expo',
    name: 'Fase 1: Expo Seguridad 2026',
    dateLabel: 'Ago 25 - Sep 10, 2026',
    status: 'completed',
    badge: '🏆 Cumplido con Éxito',
    description: 'Ensamble de prototipos, integración inicial Copter-Dock, desarrollo de Sky Remote UI y presentación pública conjunta.'
  },
  {
    id: 'calibracion',
    name: 'Fase 2: Calibración Activa & Puesta a Punto',
    dateLabel: 'Sep 11 - Oct 15, 2026',
    status: 'active',
    badge: '⚡ En Curso Ahora',
    description: 'Ensayos de motores, diseño de nuevo mecanismo con engranajes para Dock y preparación de componentes para la cancha.'
  },
  {
    id: 'cancha_demo',
    name: 'Fase 3: Vuelo en Cancha & Gran Demo USM',
    dateLabel: 'Octubre 2026 (Fecha TBD)',
    status: 'planned',
    badge: '🏟️ Hito Faro',
    description: 'Operación real en la cancha universitaria con permisos tramitados, copter aterrizando en dock y betol en sustentación.'
  },
  {
    id: 'cierre_2027',
    name: 'Fase 4: Acabado & Entrega Final',
    dateLabel: 'Nov 2026 - Mar 2027',
    status: 'future',
    badge: '🏆 Cierre Ciclo',
    description: 'Optimización de peso aerodinámico, adjudicación fondo USM, validación final y documentación institucional.'
  }
];

export const ROADMAP_PROJECTS = [
  { id: 'copter', name: 'Skycopter', icon: '🚁', color: '#0ea5e9', lightColor: '#38bdf8' },
  { id: 'dock', name: 'Skydock', icon: '⚙️', color: '#10b981', lightColor: '#34d399' },
  { id: 'remote', name: 'Sky Remote', icon: '💻', color: '#8b5cf6', lightColor: '#a78bfa' },
  { id: 'vtol', name: 'SkyVTOL', icon: '📐', color: '#ec4899', lightColor: '#f472b6' },
  { id: 'fondo', name: 'Concurso Fondo USM', icon: '🎓', color: '#eab308', lightColor: '#fde047' },
  { id: 'pista', name: 'Pista de Carreras', icon: '🏁', color: '#14b8a6', lightColor: '#2dd4bf' }
];

export const ROADMAP_NODES = [
  // =========================================================================
  // 1. SKYCOPTER (LANE 1)
  // =========================================================================
  {
    id: 'c-radxa',
    projectId: 'copter',
    phase: 'expo',
    col: 2,
    lane: 1,
    title: 'Cableado Radxa, Cámara & FC',
    shortDate: '28 Ago',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Hardware',
    description: 'Viernes 28 de agosto: Mateo realizó el cableado y conexionado de la SBC Radxa con la cámara y la Flight Controller.',
    prerequisites: [],
    unlocks: ['c-test-cam']
  },
  {
    id: 'c-test-cam',
    projectId: 'copter',
    phase: 'expo',
    col: 3,
    lane: 1,
    title: 'Montaje Cámara & Test en Tierra',
    shortDate: '29 Ago',
    status: 'done',
    leaders: 'Mateo y Renato',
    tag: 'Ensayos Tierra',
    description: 'Sábado 29 de agosto: Montaje de la cámara y la Radxa en el copter, configuración del enlace de comunicación con la FC, jornada de testeo en tierra por Mateo y Renato, y grabación del video.',
    prerequisites: ['c-radxa'],
    unlocks: ['c-incident-burn']
  },
  {
    id: 'c-incident-burn',
    projectId: 'copter',
    phase: 'expo',
    col: 4,
    lane: 1,
    title: 'Incidente Carcasa & Rediseño 3D',
    shortDate: '31 Ago - 1 Sep',
    status: 'done',
    leaders: 'Pablo y Mateo',
    tag: 'Estructura 3D',
    description: 'Lunes 31 de agosto: Al realizar el orificio para la cámara la carcasa sufrió un recalentamiento. Pablo rediseñó la estructura con ventilación optimizada y el martes 1 de septiembre se comenzó a reimprimir.',
    prerequisites: ['c-test-cam'],
    unlocks: ['c-ensamble-finish']
  },
  {
    id: 'c-ensamble-finish',
    projectId: 'copter',
    phase: 'expo',
    col: 5,
    lane: 1,
    title: 'Ensamble, Masilla, Lijado & Pintura',
    shortDate: '2 Sep',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Montaje & Acabado',
    description: 'Miércoles 2 de septiembre: Ensamble del copter reimpreso, masillado, lijado fino y pintura ejecutados por Mateo.',
    prerequisites: ['c-incident-burn'],
    unlocks: ['c-stickers']
  },
  {
    id: 'c-stickers',
    projectId: 'copter',
    phase: 'expo',
    col: 6,
    lane: 1,
    title: 'Stickers Oficiales Copter',
    shortDate: '5 Sep',
    status: 'done',
    leaders: 'Rorro y Liz',
    tag: 'Rotulación',
    description: 'Sábado 5 de septiembre: Pegado de los stickers y rotulación oficial sobre la carcasa del Copter por Rorro y Liz.',
    prerequisites: ['c-ensamble-finish'],
    unlocks: ['c-ready']
  },
  {
    id: 'c-ready',
    projectId: 'copter',
    phase: 'expo',
    col: 7,
    lane: 1,
    title: 'Skycopter Listo (Expo)',
    shortDate: '7 Sep 16:30',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Hito Operativo',
    description: 'Lunes 7 de septiembre (16:30 hrs): Skycopter listo, energizado y preparado para la prueba de despegue y posterior exposición.',
    prerequisites: ['c-stickers'],
    unlocks: ['rem-mockup', 'm-expo', 'c-landing-calib']
  },
  {
    id: 'c-landing-calib',
    projectId: 'copter',
    phase: 'calibracion',
    col: 10,
    lane: 1,
    title: 'Calibrar Mecanismo Aterrizaje',
    shortDate: 'Sep-Oct 2026',
    status: 'in_progress',
    leaders: null,
    tag: 'Calibración Aterrizaje',
    description: 'Calibración del mecanismo de aterrizaje del copter. Requiere la compra de 2 baterías LiPo de 3000 a 6000 mAh (costo aprox. $200.000).',
    prerequisites: ['c-ready'],
    unlocks: ['m-grand-demo']
  },

  // =========================================================================
  // 2. SKYDOCK (LANE 2)
  // =========================================================================
  {
    id: 'd-qr-print',
    projectId: 'dock',
    phase: 'expo',
    col: 1,
    lane: 2,
    title: 'Impresión de Código QR',
    shortDate: '25 Ago',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Patrón Visual',
    description: 'Martes 25 de agosto: Mateo realizó la impresión en 3D del código QR para el sistema visual del Skydock.',
    prerequisites: [],
    unlocks: ['d-piston']
  },
  {
    id: 'd-piston',
    projectId: 'dock',
    phase: 'expo',
    col: 2,
    lane: 2,
    title: 'Coordinar Pistón con Servos',
    shortDate: '26 Ago',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Mecatrónica',
    description: 'Miércoles 26 de agosto: Coordinación del pistón inicial con los servomotores para la apertura y cierre del dock.',
    prerequisites: ['d-qr-print'],
    unlocks: ['d-boxes-paint']
  },
  {
    id: 'd-boxes-paint',
    projectId: 'dock',
    phase: 'expo',
    col: 3,
    lane: 2,
    title: 'Pintura Interior Cajas Dock',
    shortDate: '2 Sep',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Acabado Cajas',
    description: 'Miércoles 2 de septiembre: Pintura del interior de las cajas del Skydock realizada por Mateo.',
    prerequisites: ['d-piston'],
    unlocks: ['d-servos-change']
  },
  {
    id: 'd-servos-change',
    projectId: 'dock',
    phase: 'expo',
    col: 4,
    lane: 2,
    title: 'Cambio a Servos ST3215',
    shortDate: '4 Sep',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Actuadores Seriales',
    description: 'Viernes 4 de septiembre: Reemplazo e instalación de los nuevos servos ST3215 en el Skydock.',
    prerequisites: ['d-boxes-paint'],
    unlocks: ['d-servos-prog']
  },
  {
    id: 'd-servos-prog',
    projectId: 'dock',
    phase: 'expo',
    col: 5,
    lane: 2,
    title: 'Programación Servos ST3215',
    shortDate: '5 Sep',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Control Servos',
    description: 'Sábado 5 de septiembre: Mateo programó y calibró los servomotores ST3215 del Skydock.',
    prerequisites: ['d-servos-change'],
    unlocks: ['d-stickers']
  },
  {
    id: 'd-stickers',
    projectId: 'dock',
    phase: 'expo',
    col: 6,
    lane: 2,
    title: 'Stickers Oficiales Skydock',
    shortDate: '5 Sep',
    status: 'done',
    leaders: 'Rorro y Liz',
    tag: 'Rotulación',
    description: 'Sábado 5 de septiembre: Rorro y Liz colocaron los stickers oficiales en el Skydock.',
    prerequisites: ['d-servos-prog'],
    unlocks: ['d-ready']
  },
  {
    id: 'd-ready',
    projectId: 'dock',
    phase: 'expo',
    col: 7,
    lane: 2,
    title: 'Skydock Listo (Expo)',
    shortDate: '7 Sep 16:30',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Hito Operativo',
    description: 'Lunes 7 de septiembre (16:30 hrs): Skydock operativo para la prueba de despegue y posterior presentación.',
    prerequisites: ['d-stickers'],
    unlocks: ['rem-mockup', 'm-expo', 'd-gears-design', 'd-waterproof', 'd-lids-align']
  },
  {
    id: 'd-gears-design',
    projectId: 'dock',
    phase: 'calibracion',
    col: 10,
    lane: 2,
    title: 'Diseñar Mecanismo Engranajes Autocentrado',
    shortDate: 'Sep-Oct 2026',
    status: 'in_progress',
    leaders: null,
    tag: 'Mecánica Dock v2',
    description: 'Diseño del mecanismo de engranajes para el dock, asegurando el autocentrado de las patas del dron al posarse.',
    prerequisites: ['d-ready'],
    unlocks: ['m-grand-demo']
  },
  {
    id: 'd-waterproof',
    projectId: 'dock',
    phase: 'calibracion',
    col: 11,
    lane: 2,
    title: 'Métodos Impermeabilización MDF',
    shortDate: 'Sep-Oct 2026',
    status: 'planned',
    leaders: null,
    tag: 'Sellado Intemperie',
    description: 'Exploración y aplicación de técnicas para impermeabilizar las placas de MDF del Skydock contra humedad y lluvia.',
    prerequisites: ['d-ready'],
    unlocks: []
  },
  {
    id: 'd-lids-align',
    projectId: 'dock',
    phase: 'calibracion',
    col: 12,
    lane: 2,
    title: 'Mejorar Alineación Tapas Dock',
    shortDate: 'Sep-Oct 2026',
    status: 'planned',
    leaders: null,
    tag: 'Ajuste Mecánico',
    description: 'Mejorar la alineación y cierre de las tapas del dock para un sellado perfecto.',
    prerequisites: ['d-ready'],
    unlocks: []
  },

  // =========================================================================
  // 3. SKY REMOTE (LANE 3)
  // =========================================================================
  {
    id: 'rem-mockup',
    projectId: 'remote',
    phase: 'expo',
    col: 8,
    lane: 3,
    title: 'Mockup Despegue Copter-Dock',
    shortDate: '7 Sep 17:00',
    status: 'done',
    leaders: 'Mateo (apoyo: Renato, Bicho, Rorro, Tomás)',
    tag: 'Prueba de Conjunto',
    description: 'Lunes 7 de septiembre a las 17:00: Prueba de secuencia de despegue coordinada entre Copter y Dock.',
    prerequisites: ['c-ready', 'd-ready'],
    unlocks: ['rem-web-ui']
  },
  {
    id: 'rem-web-ui',
    projectId: 'remote',
    phase: 'expo',
    col: 9,
    lane: 3,
    title: 'Programación Interfaz Web UI',
    shortDate: '7 Sep Noche',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Frontend & Control',
    description: 'Lunes 7 de septiembre en la noche: Mateo programó la interfaz web de control y telemetría para la feria.',
    prerequisites: ['rem-mockup'],
    unlocks: ['m-expo']
  },

  // =========================================================================
  // 4. SKYVTOL / BETOL (LANE 4)
  // =========================================================================
  {
    id: 'v-paint-tests',
    projectId: 'vtol',
    phase: 'expo',
    col: 1,
    lane: 4,
    title: 'Pruebas Pintura Pistola Gravedad',
    shortDate: '27 Ago',
    status: 'done',
    leaders: 'Mateo',
    tag: 'Taller',
    description: 'Jueves 27 de agosto: Mateo realizó las primeras pruebas de pintura con pistola por gravedad en el taller.',
    prerequisites: [],
    unlocks: ['v-fuselage-paint']
  },
  {
    id: 'v-compressor',
    projectId: 'vtol',
    phase: 'expo',
    col: 3,
    lane: 4,
    title: 'Reparación de Compresor',
    shortDate: '3 Sep',
    status: 'done',
    leaders: 'Renato',
    tag: 'Soporte Taller',
    description: 'Jueves 3 de septiembre: Renato reparó el compresor de pintura del taller que había fallado.',
    prerequisites: ['v-paint-tests'],
    unlocks: ['v-fuselage-paint']
  },
  {
    id: 'v-fuselage-paint',
    projectId: 'vtol',
    phase: 'expo',
    col: 4,
    lane: 4,
    title: 'Pintura & Lijado Fuselaje',
    shortDate: '3-5 Sep',
    status: 'done',
    leaders: 'Pablo',
    tag: 'Acabado Fuselaje',
    description: '3 al 5 de septiembre: Pablo aplicó capas de pintura y realizó el lijado del fuselaje del Betol durante 2-3 días de trabajo.',
    prerequisites: ['v-compressor'],
    unlocks: ['v-assembly']
  },
  {
    id: 'v-assembly',
    projectId: 'vtol',
    phase: 'expo',
    col: 5,
    lane: 4,
    title: 'Armado Mecánico del Betol',
    shortDate: '5 Sep',
    status: 'done',
    leaders: 'Pablo, Liz, Rorro',
    tag: 'Ensamble',
    description: 'Sábado 5 de septiembre: Armado de la estructura mecánica del Betol realizado por Pablo, Liz y Rorro.',
    prerequisites: ['v-fuselage-paint'],
    unlocks: ['v-stickers']
  },
  {
    id: 'v-stickers',
    projectId: 'vtol',
    phase: 'expo',
    col: 6,
    lane: 4,
    title: 'Stickers Oficiales Betol',
    shortDate: '5 Sep',
    status: 'done',
    leaders: 'Paula y Rorro',
    tag: 'Rotulación',
    description: 'Sábado 5 de septiembre: Paula y Rorro colocaron los stickers oficiales en el fuselaje del Betol.',
    prerequisites: ['v-assembly'],
    unlocks: ['m-expo', 'v-electronics', 'v-alignment']
  },
  {
    id: 'v-electronics',
    projectId: 'vtol',
    phase: 'calibracion',
    col: 10,
    lane: 4,
    title: 'Armar la Electrónica del Betol',
    shortDate: 'Octubre 2026',
    status: 'planned',
    leaders: 'Mateo',
    tag: 'Electrónica & Cableado',
    description: 'Armar y conectar la electrónica, receptores y fuentes de potencia del Betol.',
    prerequisites: ['v-stickers'],
    unlocks: ['v-flight-test']
  },
  {
    id: 'v-alignment',
    projectId: 'vtol',
    phase: 'calibracion',
    col: 11,
    lane: 4,
    title: 'Alinear Motores del Betol',
    shortDate: 'Octubre 2026',
    status: 'planned',
    leaders: null,
    tag: 'Alineación Motores',
    description: 'Alinear los motores del Betol para garantizar vector de empuje balanceado. Tarea abierta para postulación de integrantes del equipo.',
    prerequisites: ['v-stickers'],
    unlocks: ['v-flight-test']
  },
  {
    id: 'v-permits',
    projectId: 'vtol',
    phase: 'calibracion',
    col: 12,
    lane: 4,
    title: 'Gestionar Permisos Cancha USM',
    shortDate: 'Octubre 2026',
    status: 'planned',
    leaders: 'Mateo',
    tag: 'Gestión Cancha',
    description: 'Gestionar permisos institucionales para el uso de la cancha de la universidad.',
    prerequisites: [],
    unlocks: ['v-flight-test']
  },
  {
    id: 'v-flight-test',
    projectId: 'vtol',
    phase: 'cancha_demo',
    col: 13,
    lane: 4,
    title: 'Prueba de Vuelo Betol en Cancha',
    shortDate: 'Octubre 2026',
    status: 'planned',
    leaders: 'Mateo y Equipo',
    tag: 'Prueba de Vuelo',
    description: 'Prueba de sustentación y vuelo del Betol en la cancha de la USM una vez listos electrónica, motores y permisos.',
    prerequisites: ['v-electronics', 'v-alignment', 'v-permits'],
    unlocks: ['m-grand-demo', 'v-refinish-2027']
  },
  {
    id: 'v-refinish-2027',
    projectId: 'vtol',
    phase: 'cierre_2027',
    col: 15,
    lane: 4,
    title: 'Acabado Final Betol (Marzo 2027)',
    shortDate: 'Marzo 2027',
    status: 'planned',
    leaders: null,
    tag: 'Acabado Estético Final',
    description: 'Para marzo de 2027: Sacar los stickers, lijar la superficie, enmascarar, dar la última capa de pintura definitiva y colocar stickers nuevos.',
    prerequisites: ['v-flight-test'],
    unlocks: []
  },

  // =========================================================================
  // 5. CONCURSO FONDO USM (LANE 5)
  // =========================================================================
  {
    id: 'fon-video-shoot',
    projectId: 'fondo',
    phase: 'expo',
    col: 5,
    lane: 5,
    title: 'Grabación Video Fondo USM',
    shortDate: '5 Sep',
    status: 'done',
    leaders: null,
    tag: 'Audiovisual',
    description: 'Sábado 5 de septiembre: Grabación del video postulación para el concurso del Fondo USM.',
    prerequisites: [],
    unlocks: ['fon-video-edit']
  },
  {
    id: 'fon-video-edit',
    projectId: 'fondo',
    phase: 'expo',
    col: 6,
    lane: 5,
    title: 'Edición Video Fondo USM',
    shortDate: '5-6 Sep',
    status: 'done',
    leaders: null,
    tag: 'Audiovisual',
    description: '5 y 6 de septiembre: Edición y montaje del video postulación del Fondo USM.',
    prerequisites: ['fon-video-shoot'],
    unlocks: ['fon-submit']
  },
  {
    id: 'fon-submit',
    projectId: 'fondo',
    phase: 'expo',
    col: 7,
    lane: 5,
    title: 'Entrega Postulación Concurso',
    shortDate: '7 Sep',
    status: 'done',
    leaders: null,
    tag: 'Postulación',
    description: 'Lunes 7 de septiembre: Entrega oficial de la postulación al Fondo de la Universidad.',
    prerequisites: ['fon-video-edit'],
    unlocks: []
  },

  // =========================================================================
  // 6. PISTA DE CARRERAS (LANE 6)
  // =========================================================================
  {
    id: 'pis-complete',
    projectId: 'pista',
    phase: 'expo',
    col: 1,
    lane: 6,
    title: 'Pista de Carreras Drone Racing',
    shortDate: 'Agosto 2026',
    status: 'done',
    leaders: null,
    tag: 'Infraestructura',
    description: 'Pista de carreras completada y operativa en agosto de 2026.',
    prerequisites: [],
    unlocks: []
  },

  // =========================================================================
  // HITOS MAYORES DE CONVERGENCIA (LANE 2.5)
  // =========================================================================
  {
    id: 'm-expo',
    projectId: 'remote',
    phase: 'expo',
    col: 9,
    lane: 2.5,
    title: '🏆 Presentación Expo Seguridad 2026',
    shortDate: '8-10 Sep',
    status: 'done',
    leaders: 'Toda la Comunidad UAVUSM',
    tag: 'Hito Mayor Cumplido',
    isMajorMilestone: true,
    description: 'Presentación oficial de los prototipos Skycopter, Skydock, Sky Remote y fuselaje SkyVTOL en el evento de seguridad tecnológica.',
    prerequisites: ['c-ready', 'd-ready', 'rem-web-ui', 'v-stickers'],
    unlocks: ['c-landing-calib', 'd-gears-design', 'v-electronics', 'v-alignment']
  },
  {
    id: 'm-grand-demo',
    projectId: 'remote',
    phase: 'cancha_demo',
    col: 14,
    lane: 2.5,
    title: '🎓 Demostración Interna USM (Fecha TBD)',
    shortDate: 'Octubre 2026',
    status: 'planned',
    leaders: null,
    tag: 'Hito Faro (Requiere Organizador)',
    isMajorMilestone: true,
    description: 'Exhibición formal ante la universidad. Mateo no asumirá la organización; requiere que un voluntario del equipo coordine el evento, permisos, horario y difusión.',
    prerequisites: ['c-landing-calib', 'd-gears-design', 'v-flight-test'],
    unlocks: []
  }
];
