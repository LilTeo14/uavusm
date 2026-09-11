import { createClient } from '@supabase/supabase-js';

// 1. Detección y Configuración de Supabase
const env = (typeof import.meta !== 'undefined' && import.meta?.env) 
  ? import.meta.env 
  : (typeof process !== 'undefined' && process.env ? process.env : {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const adminPin = env.VITE_ADMIN_PIN || '1234';

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://tu-proyecto.supabase.co');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

console.log(
  isSupabaseConfigured 
    ? '📡 Conectado a Supabase en la nube.' 
    : '💾 Corriendo en modo LocalStorage (sin conexión a base de datos externa).'
);

// 2. Helper de Fase o Etapa de Proyecto
export function getProjectPhase(project) {
  if (!project) return 'etapa_2';
  const name = (project.name || '').toLowerCase();
  if (
    name.includes('v1') || 
    name.includes('expo seguridad') || 
    name.includes('pista de carreras') || 
    project.id === 'd5555555-5555-5555-5555-555555555555' ||
    project.id === 'd4444444-4444-4444-4444-444444444444' ||
    project.id === 'd1111111-1111-1111-1111-111111111111' ||
    project.id === 'd2222222-2222-2222-2222-222222222222' ||
    project.id === 'd3333333-3333-3333-3333-333333333333'
  ) {
    return 'etapa_1';
  }
  return 'etapa_2';
}

// 3. Datos Semilla para Inicializar LocalStorage
const SEED_PROJECTS = [
  // --- ETAPA 2: NUEVAS VERSIONES Y PROYECTOS EN CURSO ---
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    name: 'Skybetol v2',
    description: 'Segunda iteración Skybetol: Ensayos avanzados de vuelo VTOL, optimización aerodinámica, estructura alar y aviónica. Culminación final proyectada a marzo de 2027 con acabado estético completo.',
    budget: 0,
    leader_name: 'Roro',
    leader_email: 'roro@usm.cl',
    status: 'En progreso',
    due_date: '2027-03-31',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    name: 'Skycopter v2',
    description: 'Segunda iteración Skycopter: Integración de la nueva carcasa inferior reimpresa, pruebas de resistencia tras impacto, calibración de mecanismo de aterrizaje en dock y vuelo autónomo.',
    budget: 0,
    leader_name: 'Renato',
    leader_email: 'renato@usm.cl',
    status: 'En progreso',
    due_date: '2026-11-30',
    image_url: '/skycopter.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    name: 'Skydoc v2',
    description: 'Segunda iteración Skydoc: Mecanismo de engranajes motorizado, sellado hermético, impermeabilización de MDF y alimentación con 2 baterías LiPo de alta capacidad.',
    budget: 200000.00,
    leader_name: 'Tomás',
    leader_email: 'tomas@usm.cl',
    status: 'En progreso',
    due_date: '2026-11-30',
    image_url: '/skydock.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e4444444-4444-4444-4444-444444444444',
    name: 'Sky Remote v2',
    description: 'Segunda iteración: Plataforma de software, telemetría unificada y control para la operación coordinada de Skycopter y Skydock. Protocolos de comunicación y secuenciador autónomo para la demostración universitaria.',
    budget: 0,
    leader_name: 'Mateo',
    leader_email: 'mateo@usm.cl',
    status: 'En progreso',
    due_date: '2026-11-30',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd6666666-6666-6666-6666-666666666666',
    name: 'Avión Impreso en 3D',
    description: 'Nuevo proyecto UAVUSM: Diseño aeronáutico y manufactura aditiva completa de avión en impresión 3D (LW-PLA/PETG), ensamble de timones, alerones y planta motriz.',
    budget: 180000.00,
    leader_name: 'Mateo',
    leader_email: 'mateo@usm.cl',
    status: 'En progreso',
    due_date: '2026-11-30',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e7777777-7777-7777-7777-777777777777',
    name: 'Concurso Fondo USM',
    description: 'Iniciativa y postulación oficial a fondos concursables internos de la Universidad Santa María. Video pitch oficial, propuesta técnica y seguimiento de etapas de evaluación y adjudicación.',
    budget: 0,
    leader_name: 'Mateo y Bicho',
    leader_email: 'mateo@usm.cl',
    status: 'En progreso',
    due_date: '2026-11-15',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  // --- ETAPA 1: PROTOTIPOS EXPO SEGURIDAD (ENTREGADOS / CERRADOS) ---
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Skydoc v1 (Expo Seguridad)',
    description: 'Prototipo inicial de estación de aterrizaje autónoma presentado en Expo Seguridad (8-10 Sept). Entregado el 7 de septiembre de 2026.',
    budget: 100000.00,
    leader_name: 'Tomás',
    leader_email: 'tomas@usm.cl',
    status: 'Completado',
    due_date: '2026-09-07',
    image_url: '/skydock.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Skybetol v1 (Expo Seguridad)',
    description: 'Primer prototipo y recubrimiento aerodinámico de aeronave VTOL presentado en Expo Seguridad (8-10 Sept). Entregado el 7 de septiembre de 2026.',
    budget: 100000.00,
    leader_name: 'Roro',
    leader_email: 'roro@usm.cl',
    status: 'Completado',
    due_date: '2026-09-07',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Skycopter v1 (Expo Seguridad)',
    description: 'Primer prototipo de dron cuadricóptero con carcasa 3D presentado en Expo Seguridad (8-10 Sept). Entregado el 7 de septiembre de 2026.',
    budget: 330000.00,
    leader_name: 'Renato',
    leader_email: 'renato@usm.cl',
    status: 'Completado',
    due_date: '2026-09-07',
    image_url: '/skycopter.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Sky Remote (Expo Seguridad)',
    description: 'Software y control integrado para la operación conjunta de Skycopter y Skydock. Incluye interfaz web preliminar y simulación de despegue presentada en Expo Seguridad (8-10 Sept). Entregado el 7 de septiembre de 2026.',
    budget: 190000.00,
    leader_name: 'Mateo',
    leader_email: 'mateo@usm.cl',
    status: 'Completado',
    due_date: '2026-09-07',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Pista de carreras (Etapa 1)',
    description: 'Fabricación y ensamble de la pista de carreras en tubos de PVC. Entregada y finalizada el 15 de agosto de 2026.',
    budget: 200000.00,
    leader_name: 'Liss',
    leader_email: 'liss@usm.cl',
    status: 'Completado',
    due_date: '2026-08-15',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  }
];

const SEED_TASKS = [
  {
    id: 't_betol_paint',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Pintado del avión Skybetol',
    description: 'Aplicación de pintura y recubrimiento ligero en el fuselaje y alas.',
    assigned_to: 'Pablo y Mateo',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T12:00:00.000Z'
  },
  {
    id: 't_betol_stickers',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Colocación de stickers y branding',
    description: 'Aplicación de gráfica institucional y stickers oficiales en el avión Skybetol.',
    assigned_to: 'Paula y Roro',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T15:00:00.000Z'
  },
  {
    id: 't_betol_assembly',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Armado estructural del avión Skybetol',
    description: 'Montaje y ensamblado estructural final del avión.',
    assigned_to: 'Roro',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T18:00:00.000Z'
  },
  {
    id: 't_skydoc_video',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Grabación de video demostrativo Skycopter Doc',
    description: 'Pruebas de funcionamiento del dock en terreno y grabación de video operativo.',
    assigned_to: 'Mateo, Renato y Bicho',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T14:00:00.000Z'
  },
  {
    id: 't_skycopter_rebuild',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Reconstrucción y reimpresión 3D base inferior',
    description: 'Reparación de daños tras caída: reconstrucción estructural de la parte inferior y reimpresión 3D.',
    assigned_to: 'Mateo',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T20:00:00.000Z'
  },
  {
    id: 't_skycopter_testprint',
    project_id: 'e3333333-3333-3333-3333-333333333333',
    title: 'Probar reimpresión 3D',
    description: 'Ensayos mecánicos y prueba de componentes tras la reimpresión 3D.',
    assigned_to: 'Renato y Mateo',
    due_date: '2026-09-18',
    status: 'todo',
    created_at: '2026-09-10T10:00:00.000Z'
  },
  {
    id: 't_skydoc_hermetico',
    project_id: 'e1111111-1111-1111-1111-111111111111',
    title: 'Prototipado rápido de cierre hermético',
    description: 'Evaluar si Tomás realiza el prototipado rápido inicial o se hace internamente y Tomás lidera el definitivo.',
    assigned_to: 'Tomás y Mateo',
    due_date: '2026-09-25',
    status: 'todo',
    created_at: '2026-09-10T11:00:00.000Z'
  },
  {
    id: 't_betol_opt',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Diseño preliminar y optimización alar v2',
    description: 'Estudio de perfiles aerodinámicos, reducción de peso alar y posicionamiento de servomotores para Skybetol v2.',
    assigned_to: 'Roro y Pablo',
    due_date: '2026-09-28',
    status: 'todo',
    created_at: '2026-09-10T11:30:00.000Z'
  },
  {
    id: 't_plane3d_cad',
    project_id: 'd6666666-6666-6666-6666-666666666666',
    title: 'Modelado CAD y segmentación para impresión 3D',
    description: 'Diseño de perfiles aerodinámicos para avión impreso en filamento LW-PLA.',
    assigned_to: 'Mateo y Renato',
    due_date: '2026-10-15',
    status: 'todo',
    created_at: '2026-09-10T12:00:00.000Z'
  },
  // --- NUEVAS TAREAS TÉCNICAS ETAPA 2 (HACIA EVENTO DEMOSTRACIÓN Y ENTREGA 2027) ---
  {
    id: 'f1111111-0001-4000-8000-000000000001',
    project_id: 'e1111111-1111-1111-1111-111111111111',
    title: 'Diseñar nuevo mecanismo con engranajes para el dock',
    description: 'Diseño mecánico y modelado 3D de sistema de engranajes motorizado para apertura, cierre y centrado que permita el aterrizaje seguro del dron.',
    assigned_to: 'Tomás y Mateo',
    due_date: '2026-10-05',
    status: 'todo',
    created_at: '2026-09-10T14:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000002',
    project_id: 'e1111111-1111-1111-1111-111111111111',
    title: 'Buscar métodos de impermeabilización del MDF',
    description: 'Investigación y ensayo de recubrimientos sellantes, barnices hidrófugos o resinas para proteger la madera MDF del dock contra la intemperie y humedad.',
    assigned_to: 'Tomás',
    due_date: '2026-10-10',
    status: 'todo',
    created_at: '2026-09-10T14:15:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000003',
    project_id: 'e1111111-1111-1111-1111-111111111111',
    title: 'Buscar cómo mejorar la alineación de las tapas del dock',
    description: 'Ajuste de tolerancias dimensionales, guías mecánicas y bisagras para asegurar el encaje hermético y suave de las compuertas superiores.',
    assigned_to: 'Tomás',
    due_date: '2026-10-14',
    status: 'todo',
    created_at: '2026-09-10T14:30:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000001',
    project_id: 'e3333333-3333-3333-3333-333333333333',
    title: 'Terminar de calibrar mecanismo de aterrizaje',
    description: 'Calibración fina de sensores y estabilidad en tren de aterrizaje para posarse en el dock con precisión. Prerrequisito indispensable para el evento de demostración.',
    assigned_to: 'Renato y Mateo',
    due_date: '2026-10-08',
    status: 'todo',
    created_at: '2026-09-10T14:45:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000012',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Gestionar permisos para la cancha de la USM',
    description: 'Tramitación formal anticipada de permisos ante la administración del campus para reservar y autorizar las pruebas de vuelo del dron en la cancha de la universidad.',
    assigned_to: 'Mateo',
    due_date: '2026-10-02',
    status: 'todo',
    created_at: '2026-09-10T21:30:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000001',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Armar la electrónica del Betol y reconectar todo',
    description: 'Armado y conexionado del arnés eléctrico, receptor, distribución de potencia y controladora de vuelo del Skybetol a cargo exclusivo de Mateo.',
    assigned_to: 'Mateo',
    due_date: '2026-10-06',
    status: 'todo',
    created_at: '2026-09-10T15:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000002',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Alinear los motores y vectores de empuje (Postulación abierta)',
    description: 'Calibración geométrica, paralelismo y ajuste de servomotores basculantes del Skybetol. Tarea abierta para que algún integrante del equipo se postule y la lidere.',
    assigned_to: 'Por asignar (Postulación abierta)',
    due_date: '2026-10-12',
    status: 'todo',
    created_at: '2026-09-10T15:15:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000013',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Prueba de vuelo del Skybetol en la cancha de la USM',
    description: 'Ensayos en terreno de despegue vertical, sustentación y vuelo VTOL en la cancha de la universidad una vez aprobados los permisos y finalizada la electrónica y alineación.',
    assigned_to: 'Mateo y Equipo SkyVTOL',
    due_date: '2026-10-17',
    status: 'todo',
    created_at: '2026-09-10T21:30:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000003',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Retirar stickers anteriores y lijar pintura actual',
    description: 'Preparación de superficie en alas y fuselaje de SkyVTOL tras la presentación universitaria para el acabado definitivo.',
    assigned_to: 'Pablo y Roro',
    due_date: '2027-01-20',
    status: 'todo',
    created_at: '2026-09-10T15:30:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000004',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Enmascarado fino y capa final de pintura',
    description: 'Enmascarado de alta precisión y aplicación de la capa final de pintura de bajo peso con acabado uniforme.',
    assigned_to: 'Pablo y Mateo',
    due_date: '2027-02-15',
    status: 'todo',
    created_at: '2026-09-10T15:45:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000005',
    project_id: 'e2222222-2222-2222-2222-222222222222',
    title: 'Colocar nuevos stickers con diseño y colores renovados',
    description: 'Aplicación de nueva identidad gráfica oficial de SkyVTOL previa a la entrega final de marzo 2027.',
    assigned_to: 'Paula y Roro',
    due_date: '2027-02-28',
    status: 'todo',
    created_at: '2026-09-10T16:00:00.000Z'
  },
  // --- TAREAS SKY REMOTE & MOCKUP VUELO (LUNES 7 SEP & ETAPA 2) ---
  {
    id: 'f4444444-0001-4000-8000-000000000001',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Copter listo para simulación de despegue',
    description: 'Verificación y alistamiento de Skycopter para la prueba y simulación de despegue desde el dock a las 17:00 hrs.',
    assigned_to: 'Renato y Mateo',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T16:30:00.000Z'
  },
  {
    id: 'f4444444-0001-4000-8000-000000000002',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Dock listo para simulación de despegue',
    description: 'Alistamiento mecánico y compuertas de Skydock para permitir la simulación de despegue del copter.',
    assigned_to: 'Tomás y Mateo',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T16:30:00.000Z'
  },
  {
    id: 'f4444444-0001-4000-8000-000000000003',
    project_id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Mockup de vuelo: Simulación de despegue Copter desde Dock',
    description: 'Simulación a las 17:00 hrs del lunes 7 de sep para obtener la versión demo no funcional para exhibir el prototipo en la feria. Realizado con apoyo de Renato, Bicho, Roro y Tomás.',
    assigned_to: 'Mateo, Renato, Bicho, Roro y Tomás',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T17:00:00.000Z'
  },
  {
    id: 'f4444444-0001-4000-8000-000000000004',
    project_id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Programación de la interfaz web Sky Remote',
    description: 'Desarrollo de la interfaz web de control y telemetría por Mateo durante la noche del lunes 7 de septiembre previa a Expo Seguridad.',
    assigned_to: 'Mateo',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T22:00:00.000Z'
  },
  {
    id: 'f4444444-0001-4000-8000-000000000005',
    project_id: 'e4444444-4444-4444-4444-444444444444',
    title: 'Telemetría en vivo y enlace Copter-Dock v2',
    description: 'Capa de software autónomo y comunicación bidireccional para coordinar el aterrizaje en el dock con engranajes para la demostración en la USM.',
    assigned_to: 'Mateo',
    due_date: '2026-10-18',
    status: 'todo',
    created_at: '2026-09-10T16:15:00.000Z'
  },
  // --- TAREAS PREVIAS EXPO: 25 A 27 AGO (QR, PISTÓN DOCK & PRUEBAS PISTOLA GRAVEDAD) ---
  {
    id: 'f1111111-0001-4000-8000-000000000008',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Impresión del código QR de aterrizaje y docking',
    description: 'Generación técnica e impresión del código QR marcador para el centrado de la estación de aterrizaje Skydock realizada por Mateo el martes 25 de agosto.',
    assigned_to: 'Mateo',
    due_date: '2026-08-25',
    status: 'done',
    created_at: '2026-08-25T14:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000009',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Coordinación mecánica pistón con servos (descartado)',
    description: 'Trabajo en el taller para sincronizar el pistón con los servomotores mecánicos originales. Mecanismo posteriormente descartado para evolucionar al sistema con servos seriales ST3215.',
    assigned_to: 'Tomás y Mateo',
    due_date: '2026-08-26',
    status: 'done',
    created_at: '2026-08-26T18:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000008',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Primeras pruebas de pintura con pistola por gravedad',
    description: 'Ensayos iniciales de pulverización, dilución y control de capa con pistola de pintura por gravedad en el taller para definir los acabados aerodinámicos del fuselaje.',
    assigned_to: 'Pablo y Mateo',
    due_date: '2026-08-27',
    status: 'done',
    created_at: '2026-08-27T17:00:00.000Z'
  },
  // --- TAREAS PREVIAS EXPO: 28 AGO A 1 SEP (CABLEADO RADXA, TESTEO, INCIDENTE & REDISEÑO CARCASA) ---
  {
    id: 'f3333333-0001-4000-8000-000000000009',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Cableado y conexión Radxa con cámara y Flight Controller',
    description: 'Confección del arnés de cables y conexión física entre la SBC Radxa, el módulo de cámara y la controladora de vuelo (FC) realizada por Mateo el viernes 28 de agosto.',
    assigned_to: 'Mateo',
    due_date: '2026-08-28',
    status: 'done',
    created_at: '2026-08-28T18:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000010',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Montaje cámara/Radxa, comunicación FC, testeo y video',
    description: 'Montaje de la cámara y la Radxa en el copter, configuración del enlace de comunicación con la FC, jornada completa de testeo en tierra/banco por Mateo y Renato, y grabación del video demostrativo del proyecto Copter el sábado 29 de agosto.',
    assigned_to: 'Mateo y Renato',
    due_date: '2026-08-29',
    status: 'done',
    created_at: '2026-08-29T19:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000011',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Incidente de carcasa quemada & Rediseño por Pablo',
    description: 'Mientras Mateo realizaba la perforación para la cámara en el Skycopter se quemó la carcasa. Pablo aprovechó la oportunidad para rediseñar y optimizar la carcasa completa el mismo lunes 31 de agosto.',
    assigned_to: 'Pablo y Mateo',
    due_date: '2026-08-31',
    status: 'done',
    created_at: '2026-08-31T20:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000012',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Puesta en marcha e impresión 3D de la nueva carcasa',
    description: 'Preparación de archivos de laminado (slicing) y puesta en marcha de la impresión 3D de la nueva estructura rediseñada por Pablo el martes 1 de septiembre, lista para el ensamble del 2 de septiembre.',
    assigned_to: 'Renato y Mateo',
    due_date: '2026-09-01',
    status: 'done',
    created_at: '2026-09-01T21:00:00.000Z'
  },
  // --- TAREAS PREVIAS EXPO: 2 A 5 DE SEPTIEMBRE (ENSAMBLE, SERVOS & STICKERS) ---
  {
    id: 'f3333333-0001-4000-8000-000000000002',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Disponibilidad de impresiones 3D y piezas del copter',
    description: 'Hito: Disponibilidad de todas las piezas impresas en 3D en filamentos ASA y PLA para la nueva carcasa y chasis del copter.',
    assigned_to: 'Renato y Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000003',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Limpiar piezas 3D y unirlas con gotita (cianoacrilato)',
    description: 'Retiro de soportes, limpieza de piezas impresas y pegado estructural con gotita para formar la carcasa.',
    assigned_to: 'Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T12:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000004',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Masillar la carcasa del copter',
    description: 'Aplicación de masilla automotriz/poliéster para nivelar uniones y texturas de impresión.',
    assigned_to: 'Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T14:30:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000005',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Lijar la carcasa del copter',
    description: 'Lijado minucioso al agua de la masilla para dejar una superficie suave y aerodinámica.',
    assigned_to: 'Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T16:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000006',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Pintar la carcasa del copter',
    description: 'Aplicación de capas de pintura de acabado para la nueva carcasa.',
    assigned_to: 'Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T18:00:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000007',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Ensamble de la nueva versión del copter',
    description: 'Montaje e integración completa de la nueva versión del copter tras terminar la carcasa el miércoles 2 de septiembre.',
    assigned_to: 'Mateo',
    due_date: '2026-09-02',
    status: 'done',
    created_at: '2026-09-02T20:30:00.000Z'
  },
  {
    id: 'f3333333-0001-4000-8000-000000000008',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Pegado de stickers del copter',
    description: 'Colocación final de stickers y gráfica oficial en el copter el sábado 5 de septiembre.',
    assigned_to: 'Roro y Liss',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T14:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000004',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Pintar el interior de las cajas del dock',
    description: 'Pintura interior de las cajas y compartimentos del dock el viernes 4 de septiembre.',
    assigned_to: 'Mateo',
    due_date: '2026-09-04',
    status: 'done',
    created_at: '2026-09-04T12:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000005',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Cambiar servos del dock por los nuevos ST3215',
    description: 'Sustitución mecánica de los servos antiguos por los nuevos servos seriales ST3215 el viernes 4 de septiembre.',
    assigned_to: 'Mateo',
    due_date: '2026-09-04',
    status: 'done',
    created_at: '2026-09-04T16:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000006',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Programación de los nuevos servos ST3215 del dock',
    description: 'Programación de bus serial y calibración de movimiento de los nuevos servos ST3215 el sábado 5 de septiembre.',
    assigned_to: 'Mateo',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T12:00:00.000Z'
  },
  {
    id: 'f1111111-0001-4000-8000-000000000007',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Pegado de stickers del dock',
    description: 'Colocación final de stickers institucionales en el exterior del dock el sábado 5 de septiembre.',
    assigned_to: 'Roro y Liss',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T15:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000009',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Primera capa de pintura al fuselaje del Betol (Pablo)',
    description: 'Aplicación de la primera capa de pintura sobre el fuselaje del Skybetol realizada meticulosamente por Pablo el jueves 3 de septiembre.',
    assigned_to: 'Pablo',
    due_date: '2026-09-03',
    status: 'done',
    created_at: '2026-09-03T15:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000010',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Reparación del compresor de aire de pintura',
    description: 'El jueves 3 de septiembre falló el compresor de aire del taller durante el pintado. Renato identificó la falla y reparó exitosamente el compresor, restableciendo el trabajo de pintura del equipo.',
    assigned_to: 'Renato',
    due_date: '2026-09-03',
    status: 'done',
    created_at: '2026-09-03T18:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000011',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Ciclo intensivo de pintura y lijado del fuselaje (Pablo)',
    description: 'Jornadas de 2 a 3 días continuos (3 al 5 de septiembre) dedicadas por Pablo con enorme entrega técnica al lijado fino al agua y aplicación de sucesivas capas de pintura hasta completar el acabado definitivo del fuselaje.',
    assigned_to: 'Pablo',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T13:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000006',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Armado del betol',
    description: 'Armado estructural completo del avión Betol el sábado 5 de septiembre con apoyo de Pablo, Liss y Rorro.',
    assigned_to: 'Pablo, Liss y Roro',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T16:00:00.000Z'
  },
  {
    id: 'f2222222-0001-4000-8000-000000000007',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Pegado de stickers del betol',
    description: 'Colocación de stickers y rotulación oficial del Betol el sábado 5 de septiembre.',
    assigned_to: 'Paula y Roro',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T17:00:00.000Z'
  },
  // --- TAREAS CONCURSO FONDO USM ---
  {
    id: 'f7777777-0001-4000-8000-000000000001',
    project_id: 'e7777777-7777-7777-7777-777777777777',
    title: 'Grabación de video postulación Fondo USM',
    description: 'Jornada de grabación audiovisual en terreno del video pitch para el concurso de fondos de la universidad realizada el sábado 5 de septiembre.',
    assigned_to: 'Bicho y Mateo',
    due_date: '2026-09-05',
    status: 'done',
    created_at: '2026-09-05T18:00:00.000Z'
  },
  {
    id: 'f7777777-0001-4000-8000-000000000002',
    project_id: 'e7777777-7777-7777-7777-777777777777',
    title: 'Edición de video concurso Fondo USM',
    description: 'Edición de video, montaje y postproducción audiovisual durante el sábado 5 y domingo 6 de septiembre.',
    assigned_to: 'Bicho y Mateo',
    due_date: '2026-09-06',
    status: 'done',
    created_at: '2026-09-06T20:00:00.000Z'
  },
  {
    id: 'f7777777-0001-4000-8000-000000000003',
    project_id: 'e7777777-7777-7777-7777-777777777777',
    title: 'Entrega oficial de postulación (Ya en concurso)',
    description: 'Envío y entrega formal de la postulación al Fondo USM el lunes 7 de septiembre. Postulación ingresada exitosamente y actualmente en concurso.',
    assigned_to: 'Mateo y Equipo UAVUSM',
    due_date: '2026-09-07',
    status: 'done',
    created_at: '2026-09-07T14:00:00.000Z'
  },
  {
    id: 'f7777777-0001-4000-8000-000000000004',
    project_id: 'e7777777-7777-7777-7777-777777777777',
    title: 'Evaluación de jurado y adjudicación de fondos',
    description: 'Seguimiento a la deliberación del comité evaluador del fondo y resultados de adjudicación para nuevas partidas de financiamiento.',
    assigned_to: 'Equipo UAVUSM',
    due_date: '2026-11-15',
    status: 'todo',
    created_at: '2026-09-10T17:00:00.000Z'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Diseñar Carcasa',
    description: 'Modelado y simulación de la carcasa del SkyDock.',
    assigned_to: 'Tomás',
    due_date: '2026-07-15',
    status: 'todo',
    created_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222221',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Testeo Recubrimientos',
    description: 'Testeo de nuevos recubrimientos y su aplicación.',
    assigned_to: 'Bobo',
    due_date: '2026-07-15',
    status: 'todo',
    created_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Fast Release Batería',
    description: 'Diseño y ensamblaje del mecanismo de liberación rápida.',
    assigned_to: 'Paolo',
    due_date: '2026-07-20',
    status: 'todo',
    created_at: new Date().toISOString()
  },
  {
    id: 'a3333333-3333-3333-3333-333333333331',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    title: 'Diseñar Carcasa',
    description: 'Fabricación de la carcasa del SkyCopter en impresión 3d.',
    assigned_to: 'Renato',
    due_date: '2026-07-15',
    status: 'todo',
    created_at: new Date().toISOString()
  },
  {
    id: 'a4444444-4444-4444-4444-444444444441',
    project_id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Configuración del módulo AR',
    description: 'Calibrar la cámara y programar la detección de marcadores ArUco.',
    assigned_to: 'Mateo',
    due_date: '2026-07-20',
    status: 'todo',
    created_at: new Date().toISOString()
  },
  {
    id: 'a5555555-5555-5555-5555-555555555551',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    title: 'Diseño y Construcción',
    description: 'Modelado y armado de la pista en tubos de pvc.',
    assigned_to: 'Liss',
    due_date: '2026-07-10',
    status: 'todo',
    created_at: new Date().toISOString()
  }
];

const SEED_MATERIALS = [
  {
    id: 'f1111111-0002-4000-8000-000000000001',
    project_id: 'e1111111-1111-1111-1111-111111111111',
    name: '2x Baterías LiPo Grandes (3000 - 6000 mAh)',
    quantity: 2,
    unit_price: 100000.00,
    status: 'approved',
    purchase_status: 'por_comprar',
    requested_by: 'Tomás y Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b3333333-0002-4000-8000-000000000001',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Masilla para carcasa y lijas al agua',
    quantity: 1,
    unit_price: 15000.00,
    status: 'approved',
    purchase_status: 'disponible',
    requested_by: 'Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b3333333-0002-4000-8000-000000000002',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Adhesivo cianoacrilato (gotita)',
    quantity: 2,
    unit_price: 4000.00,
    status: 'approved',
    purchase_status: 'disponible',
    requested_by: 'Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b1111111-0002-4000-8000-000000000002',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Servomotores seriales ST3215 (Dock)',
    quantity: 2,
    unit_price: 32500.00,
    status: 'approved',
    purchase_status: 'disponible',
    requested_by: 'Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Filamentos y fijaciones',
    quantity: 1,
    unit_price: 60000.00,
    status: 'approved',
    purchase_status: 'disponible',
    requested_by: 'Tomás',
    created_at: new Date().toISOString()
  },
  {
    id: 'b1111111-1111-1111-1111-111111111112',
    project_id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Componentes de acople de carga',
    quantity: 1,
    unit_price: 40000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Tomás',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222221',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Lijas',
    quantity: 1,
    unit_price: 30000.00,
    status: 'approved',
    purchase_status: 'por_comprar',
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Pigmento',
    quantity: 1,
    unit_price: 5000.00,
    status: 'approved',
    purchase_status: 'pedido',
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222223',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Filtros Vapores',
    quantity: 1,
    unit_price: 25000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222224',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Gramera 0.01g',
    quantity: 1,
    unit_price: 15000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222225',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Pinceles / Esponjas',
    quantity: 1,
    unit_price: 10000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222226',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Visita Enaer',
    quantity: 1,
    unit_price: 15000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Bobo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b3333333-3333-3333-3333-333333333331',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Frame',
    quantity: 1,
    unit_price: 180000.00,
    status: 'approved',
    purchase_status: 'por_comprar',
    requested_by: 'Renato',
    created_at: new Date().toISOString()
  },
  {
    id: 'b3333333-3333-3333-3333-333333333332',
    project_id: 'd3333333-3333-3333-3333-333333333333',
    name: 'FC ArduPilot',
    quantity: 1,
    unit_price: 150000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Renato',
    created_at: new Date().toISOString()
  },
  {
    id: 'b4444444-4444-4444-4444-444444444441',
    project_id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Cámara de alta velocidad',
    quantity: 1,
    unit_price: 90000.00,
    status: 'approved',
    purchase_status: 'pedido',
    requested_by: 'Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b4444444-4444-4444-4444-444444444442',
    project_id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Computador de placa reducida (SBC)',
    quantity: 1,
    unit_price: 60000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Mateo',
    created_at: new Date().toISOString()
  },
  {
    id: 'b5555555-5555-5555-5555-555555555551',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Tubos de PVC',
    quantity: 1,
    unit_price: 120000.00,
    status: 'approved',
    purchase_status: 'por_comprar',
    requested_by: 'Liss',
    created_at: new Date().toISOString()
  },
  {
    id: 'b5555555-5555-5555-5555-555555555552',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Accesorios de unión y meta',
    quantity: 1,
    unit_price: 80000.00,
    status: 'pending',
    purchase_status: null,
    requested_by: 'Liss',
    created_at: new Date().toISOString()
  }
];

const SEED_NOTES = [
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Métodos de Recubrimiento Ultra-Ligero para UAVs de Espuma',
    content: `# Métodos de Recubrimiento Ultra-Ligero para UAVs de Espuma

## 1. Fibra de Vidrio Delgada + Barniz al Agua (WBPU) Pigmentado
*Rigidez estructural real y color blanco en un solo paso, eliminando pasta de muro, primer y pintura.*

*   **Proceso:**
    1. Se coloca tela de fibra de vidrio ultra-delgada (**0.5 oz/yd² o 0.75 oz/yd²**) sobre la plumavit.
    2. Se prepara **Barniz de Poliuretano al Agua (WBPU)** mezclado con **10% a 15% de Tinta Acrílica Blanca de alta pigmentación**.
    3. Se aplica sobre la fibra, retirando inmediatamente todo el exceso con una espátula de plástico. El agua se evapora al secar.
*   **Peso:** ~15-18 g/m².
*   **Curvas:** Excelente adaptación tridimensional.
*   **Ventaja:** Aporta rigidez estructural real y color blanco continuo sin costuras.

---

## 2. Masilla de Microesferas + Tinta Acrílica (Aerógrafo)
*El método de menor peso enfocado puramente en eliminar la textura de la espuma de forma estética.*

*   **Proceso:**
    1. Se aplica una capa mínima de **Pasta Muro Liviana** (microesferas huecas) únicamente para rellenar los poros de la plumavit.
    2. Se lija la superficie hasta que la masilla solo quede en los valles de la espuma.
    3. Se aplica **Tinta Acrílica líquida** blanca con aerógrafo en capas microscópicas de alta pigmentación.
*   **Peso:** ~8-12 g/m².
*   **Curvas:** Adaptación perfecta.
*   **Ventaja:** Acabado liso y continuo de aspecto comercial sin peso. No aporta rigidez.

---

## 3. Papel Japón + Barniz al Agua (WBPU) Pigmentado
*Piel protectora blanca continua sin costuras, alternativa ligera a la fibra de vidrio.*

*   **Proceso:**
    1. Se presenta **Papel Japón** (seda de aeromodelismo de 9-12 g/m²) blanco sobre la espuma.
    2. Se adhiere aplicando **Barniz al Agua (WBPU)** mezclado con un 10% de tinta acrílica blanca. Al mojarse, el papel se amolda a las curvas sin arrugas.
    3. Las fibras del papel se fusionan y las uniones desaparecen al secar y lijar suavemente.
*   **Peso:** ~15 g/m².
*   **Curvas:** Excelente adaptación.
*   **Ventaja:** Muy ligero, proporciona una piel protectora continua.

---

## 4. Doculam (Film de Laminar) con "Pintura Invertida" (Back-painting)
*Acabado brillante tipo plástico comercial, protegiendo la pintura bajo el film.*

*   **Proceso:**
    1. Se usa **Doculam transparente (1.5 mil / 38 micras)**.
    2. Se pinta la cara del pegamento (el reverso) con una capa muy fina de pintura acrílica blanca.
    3. Se aplica a la plumavit usando una plancha de entelar a baja temperatura (90°C-100°C).
*   **Peso:** ~25-30 g/m².
*   **Curvas:** Difícil en curvas esféricas pronunciadas (obliga a hacer traslapes visibles).
*   **Ventaja:** Acabado brillante impecable, protege el color contra rayones.

---

## 5. Film Termocontraíble Elástico Opaque (Oralight / Solite)
*Piel plástica termocontraíble de color directo, más elástica que el Monokote.*

*   **Proceso:**
    1. Se usa film especializado ultra-ligero (**Oralight de 36 g/m²** o **Solite**) en color blanco brillante.
    2. Se aplica con plancha a baja temperatura para no derretir la espuma.
    3. En curvas pronunciadas, se estira físicamente con la mano caliente para adaptarlo a la forma 3D antes de sellarlo.
*   **Peso:** ~30-36 g/m².
*   **Curvas:** Requiere mucha destreza y calor controlado para evitar arrugas y cortes en curvas complejas.
*   **Ventaja:** Acabado plástico limpio de fábrica, sin pintura.

---

## Comparativa Técnica Completa

| Criterio | 1. Fibra + WBPU Pigmentado | 2. Masilla + Tinta Aerógrafo | 3. Papel Japón + WBPU | 4. Doculam Pintado | 5. Oralight / Solite |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Peso Añadido** | Bajo (~16 g/m²) | **Mínimo (~10 g/m²)** | Bajo (~15 g/m²) | Moderado (~28 g/m²) | Moderado (~33 g/m²) |
| **Rigidez Estructural** | **Alta** | Nula | Media | Media-Alta | Media-Alta |
| **Acabado Sin Uniones** | Excelente | Excelente | Excelente | Regular (Se notan juntas) | Regular (Se notan juntas) |
| **Adaptabilidad a Curvas** | Excelente | Excelente | Excelente | Complejo | Complejo |`,
    file_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e5555555-5555-5555-5555-555555555551',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    title: 'Presupuesto de Materiales Detallado: Pista de Drones FPV Recreativa (Capped $200k)',
    content: `# Presupuesto de Materiales Detallado: Pista de Drones FPV Recreativa (Capped $200k)

Este documento contiene el desglose físico de los materiales necesarios para la construcción de la pista. Los costos de los tubos de PVC se basan estrictamente en la imagen image_191d22.png ($3.790 CLP por unidad de 6 m). Para los otros materiales, se incluyen estimaciones reales de retail de construcción en Chile.

## Planilla General de Materiales (BOM)

| Elemento de la Pista | Material de Construcción | Detalle / Rendimiento | Cantidad | Costo Unitario | Costo Subtotal |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **A. Pórticos de Carrera** *(4 Unidades)* | • Tubo PVC 25 mm × 6 m<br>• Fierro construcción 10 mm<br>• Tela TNT (Friselina brillante) | Arco estructural flexible<br>Para cortar 8 estacas (60 cm)<br>Vestido visible de arcos (tiras) | 4 u<br>1 u<br>4 m | $3.790<br>$5.000<br>$1.500 | $15.160<br>$5.000<br>$6.000 |
| | *Subtotal Pórticos* | | | | **$26.160** |
| **B. Postes de Slalom** *(6 Unidades)* | • Tubo PVC 25 mm × 6 m<br>• Fierro construcción 10 mm<br>• Fideos flotadores de espuma | Mástiles de 2 m (sobra 1 tramo)<br>Para cortar 6 estacas (60 cm)<br>Protector para golpes de hélice | 2 u<br>0.5 u<br>6 u | $3.790<br>$5.000<br>$2.000 | $7.580<br>$2.500<br>$12.000 |
| | *Subtotal Slalom* | | | | **$22.080** |
| **C. Túnel de Velocidad** *(1 Unidad - 4m largo)* | • Tubo PVC 25 mm × 6 m<br>• Fierro construcción 10 mm<br>• Plástico agrícola negro (4 m ancho) | Arcos de soporte del túnel<br>Para cortar 6 estacas (60 cm)<br>Cubierta inmersiva del túnel | 3 u<br>1 u<br>6 m | $3.790<br>$5.000<br>$2.500 | $11.370<br>$5.000<br>$15.000 |
| | *Subtotal Túnel* | | | | **$31.370** |
| **D. Landing Pad** *(1 Unidad)* | • Parasol redondo de auto<br>• Spray Rust-Oleum (Naranjo Flúor) | Base reflectante (≈ 80 cm)<br>Pintura de alta visibilidad | 1 u<br>1 u | $4.500<br>$6.500 | $4.500<br>$6.500 |
| | *Subtotal Landing Pad* | | | | **$11.000** |
| **E. Colimador** *(4 Unidades)* | • Baldes plásticos de 20 Litros<br>• Spray acrílico (Negro Mate) | Carcasas para códigos QR<br>Evita reflejos de luz interior | 4 u<br>1 u | $3.500<br>$4.500 | $14.000<br>$4.500 |
| | *Subtotal Colimadores* | | | | **$18.500** |
| **F. Banderas de Giro** *(4 Unidades)* | • Tubo PVC 25 mm × 6 m<br>• Fierro construcción 10 mm<br>• Tela TNT (Color contrastante) | Mástiles de 3 m (cortados a la mitad)<br>Para cortar 4 estacas (60 cm)<br>Vela triangular de giro | 2 u<br>0.5 u<br>2 m | $3.790<br>$5.000<br>$1.500 | $7.580<br>$2.500<br>$3.000 |
| | *Subtotal Banderas* | | | | **$13.080** |
| **G. Toldo e Infraestructura** *(Sujeción general)* | • Toldo plegable básico 3 × 3 m<br>• Alambre de amarre blando (Rollo)<br>• Amarras plásticas (Zipties x100)<br>• Cinta de embalar transparente | Protección para piloto y equipos<br>Asegurar uniones de estructuras<br>Fijaciones rápidas de elementos<br>Impermeabilizar códigos QR | 1 u<br>1 u<br>1 u<br>1 u | $34.990<br>$4.000<br>$3.500<br>$2.000 | $34.990<br>$4.000<br>$3.500<br>$2.000 |
| | *Subtotal Infraestructura* | | | | **$44.490** |
| **H. Delimitación de Curvas** *(1 set)* | • Conos de plástico / Tachuelas | Marcadores de curvas terrestres en la zona de velocidad | 1 u | $5.000 | $5.000 |
| | *Subtotal Delimitación* | | | | **$5.000** |
| **TOTAL MATERIALES** | **Monto total estimado para la pista** | | | | **$171.680** |
| **RESERVA DE SEGURIDAD** | **Fondo para variaciones e imprevistos** | | | | **$28.320** |
| **PRESUPUESTO MÁXIMO** | **Límite de Gasto Establecido** | | | | **$200.000** |

## Notas de Compra y Rendimiento de Materiales:

1. **Tubos de PVC (25 mm):** Comprando **11 unidades** de **6 m** (según el precio de image_191d22.png) cubren exactamente los **4 pórticos**, **6 postes de slalom** (con descarte mínimo), los **3 arcos** del túnel y las **4 banderas de giro**, con un tramo de **2 m** de PVC de repuesto.
2. **Fierros de construcción (10 mm):** Con un total de **3 barras** de **6 m** se consiguen cortar exactamente las **24 estacas** de **60 cm** necesarias para anclar toda la pista.
3. **Fondo de Reserva:** Les quedan libres **$28.320 CLP** para absorber pequeñas variaciones de precios en el retail o comprar rollos de cinta adhesiva adicionales si hiciera falta.`,
    file_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e5555555-5555-5555-5555-555555555552',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    title: 'Propuesta Técnica: Pista de Drones Recreativa FPV (Edición DIY - Ultra Económica)',
    content: `# Propuesta Técnica: Pista de Drones Recreativa FPV (Edición DIY - Ultra Económica)

Este documento detalla la planificación, el diseño de obstáculos y la logística para la implementación de una pista de carreras de drones para uso personal y recreativo. El circuito está diseñado para ser construido en formato DIY (Hágalo usted mismo) por los propios pilotos, optimizando el presupuesto al mínimo y manteniendo las dinámicas de juego originales de contrarreloj individual.

## 1. Concepto y Flujo del Circuito Recreativo

Al tratarse de un circuito de pilotos para pilotos, buscamos máxima diversión técnica con materiales sencillos de conseguir en el retail de construcción (ferretería local).

### Flujo Oficial del Recorrido:

1. **Plataforma de Despegue (Take-off Pad):** Ubicada junto al toldo de control. El cronómetro comienza a correr de manera automática al despegar.
2. **Pórtico de Partida (Gate 1):** Primer arco que atraviesa el dron inmediatamente después del despegue para encarar el circuito.
3. **Zona de Slalom y Precisión:** Estructuras de PVC flexibles con fideos flotadores de piscina. Consta de 6 postes en total. El piloto avanza zigzaguenado los primeros 3 postes, escanea el **primer código QR (QR 1 - Slalom)** dentro del balde colimador, y completa el zigzag con los siguientes 3 postes.
4. **Pórtico de Altura (Gate 2):** Marca el ingreso a la zona de maniobras verticales.
5. **Zona de Altura:** El piloto debe realizar un ascenso controlado para escanear el **segundo código QR (QR 2 - Altitud)** ubicado en una posición elevada (colimador elevado sobre soporte o mástil), para luego descender inmediatamente.
6. **Pórtico de Salida de Altura (Gate 3):** Marca el retorno del piloto a nivel del suelo.
7. **Zona de Velocidad en Curvas:** El piloto acelera siguiendo las tachuelas o marcas en el suelo que indican una serie de curvas rápidas terrestres. En esta zona escanea el **tercer código QR (QR 3 - Curvas)** situado en el suelo.
8. **Pórtico del Túnel (Gate 4):** Marca el ingreso al tramo cerrado final.
9. **Túnel de Velocidad DIY:** Estructura de arcos de PVC cubierta con plástico negro que simula un túnel oscuro. A mitad del túnel se localiza el **cuarto código QR (QR 4 - Túnel)**.
10. **Landing Pad de Aterrizaje:** Ubicado al salir del túnel. El tiempo se detiene inmediatamente al asentar de forma estable las hélices en el pad.

## 2. Componentes de la Pista y Construcción Casera

### A. Pórticos de Carrera (Gates) - 4 unidades
*   **Estructura base:** 2 tubos de PVC conduit de **20 mm × 3 m** por cada pórtico, unidos al centro para formar un gran arco flexible de **6 metros** de longitud total.
*   **Anclaje:** Se entierran estacas de fierro de construcción (**8 mm o 10 mm**) en la tierra, y los extremos de los tubos de PVC se introducen en ellas.
*   **Visibilidad:** Se envuelve el PVC con cinta de peligro (amarilla/negra) o con tiras de tela TNT brillante.

### B. Postes de Slalom - 6 unidades
*   **Estructura base:** 1 tubo de PVC de **20 mm** por poste, fijado al suelo con estacas de fierro.
*   **Protección contra impactos:** Se forra cada poste con un fideo flotador de espuma para piscina.

### C. Túnel FPV DIY - 1 unidad
*   **Estructura:** 3 arcos de PVC conduit fijados al suelo con estacas.
*   **Cubierta:** Plástico negro de invernadero o malla de sombreo formando un túnel inmersivo de **4 metros** de largo.

### D. Banderas de Giro (Flags) - 4 unidades
*   **Construcción:** Mástiles hechos con tubos de PVC de **3 metros** con velas de tela TNT cortadas en forma de pluma.

### E. Landing Pad de Aterrizaje
*   **Construcción:** Un parasol redondo para auto de **80 cm** de diámetro pintado de naranjo flúor con una gran "H" al centro.

### F. Colimadores (Tarros QR) - 4 unidades
*   **Construcción:** Baldes plásticos de **20 litros** pintados interiormente con negro mate. Uno de ellos se monta en una estructura elevada para la zona de altura.

### G. Delimitación de Curvas
*   **Construcción:** Conos plásticos de entrenamiento o tachuelas de alta visibilidad para trazar la línea de vuelo en el suelo.

## 3. Dinámica de Validación por Códigos QR con Tarros Caseros

Mantener esta mecánica es muy sencillo y no requiere gastos tecnológicos:
*   **Los Colimadores (Tarros QR):** Usaremos baldes plásticos para bloquear la luz solar directa. Se pega el código QR en el fondo.
*   **Regla de Validación:** Al finalizar el vuelo, el piloto busca en su video grabado (DVR) de las gafas FPV los fotogramas donde pasa frente a los 4 tarros QR, pausa el video y los escanea con su celular para validar su circuito. Si falta un código QR, se aplica una penalización de **+15 segundos** en el cronómetro por cada uno ausente.

## 4. Protocolo de Cronometraje Manual (1 Solo Juez)

Al ser una carrera recreativa entre amigos, un piloto que no esté compitiendo en el turno actual actuará como el juez de pista:
1. **Salida:** El juez da la orden de despegue y el tiempo se inicia en el instante del despegue.
2. **Meta:** El cronómetro se detiene en seco cuando el dron aterriza de manera estable en el Landing Pad.
3. **Puntuación:** Los tiempos se registran y se aplican las penalizaciones según los QRs validados en el DVR.`,
    file_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'e5555555-5555-5555-5555-555555555553',
    project_id: 'd5555555-5555-5555-5555-555555555555',
    title: 'Presentación del Evento: Experiencia y Dinámica de la Pista de Drones FPV',
    content: `# Presentación del Evento: Experiencia y Dinámica de la Pista de Drones FPV

Esta presentación detalla la experiencia del circuito de carrera de drones en primera persona (FPV) diseñado para eventos, demostraciones y competencias de precisión. Los participantes y espectadores experimentarán la adrenalina del vuelo a alta velocidad mediante un formato de contrarreloj individual, donde la destreza y la precisión de los pilotos son los factores clave.

## 1. Diseño y Distribución de la Pista

La pista está diseñada con un flujo continuo y dinámico que desafía diferentes habilidades de pilotaje (precisión, control de altura, velocidad y vuelo a ciegas). La distribución oficial del circuito consta de los siguientes sectores en orden de recorrido:

1. **Plataforma de Despegue (Take-off Pad):** Punto de partida desde donde el piloto inicia el vuelo y comienza a correr el tiempo oficialmente.
2. **Pórtico de Partida (Gate 1):** El primer arco de paso que marca el inicio del recorrido cronometrado tras el despegue.
3. **Zona de Slalom y Precisión:** Una secuencia de seis postes verticales. El piloto debe realizar un zigzag de precisión:
   - Supera los primeros 3 postes de slalom.
   - Escanea el **Primer Punto de Control QR (QR 1 - Slalom)**.
   - Completa los siguientes 3 postes de slalom.
4. **Pórtico de Altura (Gate 2):** Un arco de paso que delimita el ingreso a la sección de maniobra vertical.
5. **Zona de Altitud y Control Vertical:** El piloto debe ascender verticalmente para realizar una lectura aérea:
   - Escanea el **Segundo Punto de Control QR (QR 2 - Altura)**, ubicado en una zona elevada.
   - Desciende controladamente para alinear al suelo.
6. **Pórtico de Salida de Altura (Gate 3):** Un arco que marca la salida de la zona elevada y entrada a la sección terrestre.
7. **Zona de Velocidad y Curvas:** Un tramo terrestre rápido con curvas marcadas con indicadores en el suelo (tachuelas), donde el piloto debe seguir la trayectoria y:
   - Escanea el **Tercer Punto de Control QR (QR 3 - Curvas)** en el suelo.
8. **Pórtico del Túnel (Gate 4):** El arco de acceso que introduce al piloto al tramo final cerrado.
9. **Túnel Inmersivo:** Un tramo cubierto que desafía la visibilidad FPV, el cual incluye:
   - El **Cuarto Punto de Control QR (QR 4 - Túnel)** ubicado en el punto medio del túnel.
10. **Plataforma de Aterrizaje de Precisión (Landing Pad):** Ubicada inmediatamente a la salida del túnel. El tiempo se detiene en el instante exacto en que el dron realiza un contacto estable en esta plataforma.

---

## 2. Dinámica de Validación por Códigos QR (Sistema de Puntos de Control)

Para asegurar que todos los pilotos completen el recorrido oficial sin omitir ninguna zona, la pista cuenta con un sistema de verificación visual interactivo:

* **Puntos de Control QR:** Se disponen 4 dispositivos ópticos especiales en ubicaciones estratégicas a lo largo del circuito (Slalom, Altura, Curvas y Túnel).
* **Verificación de Vuelo:** Durante el recorrido, la cámara a bordo del dron registra el trayecto. Al finalizar, se verifica que la grabación contenga los fotogramas del paso por cada uno de los 4 puntos de control.
* **Penalizaciones:** En caso de omitir o no registrar el paso por alguno de los puntos de control QR, se aplicará una penalización automática de **+15 segundos** al tiempo final del piloto por cada punto omitido. Esto garantiza el juego limpio y recompensa la precisión sobre la velocidad desmedida.

---

## 3. Dinámica de Cronometraje y Puntuación

La competencia sigue un formato de contrarreloj individual ágil y transparente:

1. **Procedimiento de Salida:** El tiempo comienza a correr de manera automática en el instante del despegue desde la Plataforma de Despegue.
2. **Registro de Tiempo:** El tiempo corre de forma continua mientras el dron esté en el aire sorteando la secuencia de pórticos y zonas.
3. **Procedimiento de Meta:** El cronómetro se detiene en el instante exacto en que el dron realiza un aterrizaje estable sobre la Plataforma de Aterrizaje a la salida del túnel.
4. **Resultados:** El tiempo de vuelo obtenido se complementa con las validaciones de los 4 códigos QR. El piloto con el menor tiempo total (tiempo registrado más penalizaciones, si las hubiera) liderará la tabla de posiciones del evento.`,
    file_url: null,
    created_at: new Date().toISOString()
  }
];

const SEED_TRIALS = [
  {
    id: 't2222222-2222-2222-2222-222222222222',
    project_id: 'd2222222-2222-2222-2222-222222222222',
    columns: ["Método", "Espesor / Capas", "Peso (g/m²)", "Resistencia Impacto", "Estado Visual", "Confirmado Por"],
    rows: ["Ensayo 1: Fibra + WBPU", "Ensayo 2: Papel Japón", "Ensayo 3: Masilla de Microesferas", "Ensayo 4: Doculam"],
    cells: {
      "0_0": { value: "Ensayo 1: Fibra + WBPU", confirmed: false },
      "1_0": { value: "Ensayo 2: Papel Japón", confirmed: false },
      "2_0": { value: "Ensayo 3: Masilla de Microesferas", confirmed: false },
      "3_0": { value: "Ensayo 4: Doculam", confirmed: false }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_AVAILABILITY = {
  '2026-2': {}
};

// Inicializar datos en LocalStorage si están vacíos
const initializeLocalStorage = () => {
  if (!localStorage.getItem('uavusm_projects')) {
    localStorage.setItem('uavusm_projects', JSON.stringify(SEED_PROJECTS));
  }
  if (!localStorage.getItem('uavusm_tasks')) {
    localStorage.setItem('uavusm_tasks', JSON.stringify(SEED_TASKS));
  }
  if (!localStorage.getItem('uavusm_materials')) {
    localStorage.setItem('uavusm_materials', JSON.stringify(SEED_MATERIALS));
  }
  if (!localStorage.getItem('uavusm_notes')) {
    localStorage.setItem('uavusm_notes', JSON.stringify(SEED_NOTES));
  }
  if (!localStorage.getItem('uavusm_trials')) {
    localStorage.setItem('uavusm_trials', JSON.stringify(SEED_TRIALS));
  }
  // Limpiar cualquier dato falso previo para que todos comiencen en "Sin definir"
  const savedAvail = localStorage.getItem('uavusm_availability');
  if (!savedAvail || savedAvail.includes('Dedicado a software')) {
    localStorage.setItem('uavusm_availability', JSON.stringify(SEED_AVAILABILITY));
  }
};

if (!isSupabaseConfigured) {
  initializeLocalStorage();
}

// Helper para hash criptográfico de contraseñas (SHA-256)
export async function hashPassword(password) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

// 3. API del Servicio de Datos (Encapsula la lógica de Supabase vs LocalStorage)
export const dbService = {
  // Comprobar si el PIN ingresado es de Administrador (PIN Maestro o Contraseña de Mateo)
  verifyAdminPin(pin) {
    if (pin === adminPin) return true;
    // Si Mateo tiene guardada una clave y coincide en texto plano / sincronía local
    const creds = this.getLocalCredentials();
    if (creds['mateo']?.quickKey && creds['mateo'].quickKey === pin) return true;
    return false;
  },

  // Obtener credenciales locales almacenadas
  getLocalCredentials() {
    try {
      return JSON.parse(localStorage.getItem('uavusm_user_credentials') || '{}');
    } catch (e) {
      return {};
    }
  },

  // Comprobar si un usuario ya tiene contraseña configurada
  hasUserPassword(userId) {
    if (!userId) return false;
    const creds = this.getLocalCredentials();
    return !!(creds[userId] && creds[userId].hash);
  },

  // Asignar o actualizar la contraseña de un usuario
  async setUserPassword(userId, password) {
    if (!userId || !password) return false;
    const hash = await hashPassword(password);
    const creds = this.getLocalCredentials();
    creds[userId] = {
      hash,
      quickKey: userId === 'mateo' ? password : undefined,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('uavusm_user_credentials', JSON.stringify(creds));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('user_credentials').upsert({
          user_id: userId,
          password_hash: hash,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Sync user credential to Supabase skipped:', err?.message || err);
      }
    }
    return true;
  },

  // Verificar la contraseña de un usuario específico
  async verifyUserPassword(userId, password) {
    if (!userId || !password) return false;

    // Failsafe / Maestro: Mateo siempre puede usar el PIN admin de emergencia si lo necesita
    if (userId === 'mateo' && password === adminPin) {
      return true;
    }

    const creds = this.getLocalCredentials();
    const userCred = creds[userId];
    if (!userCred || !userCred.hash) {
      return false; // Sin contraseña configurada aún
    }

    const inputHash = await hashPassword(password);
    return inputHash === userCred.hash;
  },

  // Dejar sin contraseña a un usuario (Reset de Administrador)
  async removeUserPassword(userId) {
    if (!userId) return false;
    const creds = this.getLocalCredentials();
    if (creds[userId]) {
      delete creds[userId];
      localStorage.setItem('uavusm_user_credentials', JSON.stringify(creds));
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('user_credentials').delete().eq('user_id', userId);
      } catch (err) {
        console.warn('Delete user credential from Supabase skipped:', err?.message || err);
      }
    }
    return true;
  },

  // Obtener estado de contraseñas de todos los usuarios
  getAllUsersPasswordStatus() {
    const creds = this.getLocalCredentials();
    const status = {};
    for (const [id, item] of Object.entries(creds)) {
      if (item && item.hash) {
        status[id] = {
          hasPassword: true,
          updated_at: item.updated_at
        };
      }
    }
    return status;
  },

  // Sincronizar credenciales desde Supabase si la tabla existe
  async syncCredentialsFromCloud() {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('user_credentials').select('*');
      if (error || !data) return;
      const creds = this.getLocalCredentials();
      data.forEach(row => {
        creds[row.user_id] = {
          hash: row.password_hash,
          updated_at: row.updated_at
        };
      });
      localStorage.setItem('uavusm_user_credentials', JSON.stringify(creds));
    } catch (e) {
      // Ignorar si la tabla no está creada aún en la nube
    }
  },

  // Comprobar credenciales de Administrador (acepta contraseña de Mateo o PIN Maestro)
  async verifyAdminCredentials(input) {
    if (!input) return false;
    if (input === adminPin) return true;
    return await this.verifyUserPassword('mateo', input);
  },

  // --- PROYECTOS ---
  async getProjects() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem('uavusm_projects'));
    }
  },

  async updateProject(id, projectData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const projects = JSON.parse(localStorage.getItem('uavusm_projects'));
      const index = projects.findIndex(p => p.id === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...projectData };
        localStorage.setItem('uavusm_projects', JSON.stringify(projects));
        return projects[index];
      }
      throw new Error('Proyecto no encontrado');
    }
  },

  // --- MATERIALES ---
  async getMaterials() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem('uavusm_materials'));
    }
  },

  async createMaterial(materialData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('materials')
        .insert([materialData])
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const materials = JSON.parse(localStorage.getItem('uavusm_materials'));
      const newMaterial = {
        id: 'm_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        status: 'pending',
        purchase_status: null,
        ...materialData
      };
      materials.push(newMaterial);
      localStorage.setItem('uavusm_materials', JSON.stringify(materials));
      return newMaterial;
    }
  },

  async updateMaterial(id, materialData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('materials')
        .update(materialData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const materials = JSON.parse(localStorage.getItem('uavusm_materials'));
      const index = materials.findIndex(m => m.id === id);
      if (index !== -1) {
        materials[index] = { ...materials[index], ...materialData };
        localStorage.setItem('uavusm_materials', JSON.stringify(materials));
        return materials[index];
      }
      throw new Error('Material no encontrado');
    }
  },

  async deleteMaterial(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const materials = JSON.parse(localStorage.getItem('uavusm_materials'));
      const filtered = materials.filter(m => m.id !== id);
      localStorage.setItem('uavusm_materials', JSON.stringify(filtered));
      return true;
    }
  },

  // --- TAREAS ---
  async getTasks() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem('uavusm_tasks'));
    }
  },

  async createTask(taskData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const tasks = JSON.parse(localStorage.getItem('uavusm_tasks'));
      const newTask = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        status: 'todo',
        ...taskData
      };
      tasks.push(newTask);
      localStorage.setItem('uavusm_tasks', JSON.stringify(tasks));
      return newTask;
    }
  },

  async updateTask(id, taskData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const tasks = JSON.parse(localStorage.getItem('uavusm_tasks'));
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...taskData };
        localStorage.setItem('uavusm_tasks', JSON.stringify(tasks));
        return tasks[index];
      }
      throw new Error('Tarea no encontrada');
    }
  },

  async deleteTask(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const tasks = JSON.parse(localStorage.getItem('uavusm_tasks'));
      const filtered = tasks.filter(t => t.id !== id);
      localStorage.setItem('uavusm_tasks', JSON.stringify(filtered));
      return true;
    }
  },

  // --- NOTAS ---
  async getNotes() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem('uavusm_notes') || '[]');
    }
  },

  async createNote(noteData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('project_notes')
        .insert([noteData])
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const notes = JSON.parse(localStorage.getItem('uavusm_notes') || '[]');
      const newNote = {
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        ...noteData
      };
      notes.push(newNote);
      localStorage.setItem('uavusm_notes', JSON.stringify(notes));
      return newNote;
    }
  },

  async updateNote(id, noteData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('project_notes')
        .update(noteData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const notes = JSON.parse(localStorage.getItem('uavusm_notes') || '[]');
      const index = notes.findIndex(n => n.id === id);
      if (index !== -1) {
        notes[index] = { ...notes[index], ...noteData };
        localStorage.setItem('uavusm_notes', JSON.stringify(notes));
        return notes[index];
      }
      throw new Error('Nota no encontrada');
    }
  },

  async deleteNote(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const notes = JSON.parse(localStorage.getItem('uavusm_notes') || '[]');
      const filtered = notes.filter(n => n.id !== id);
      localStorage.setItem('uavusm_notes', JSON.stringify(filtered));
      return true;
    }
  },

  // --- NOTAS PRIVADAS DE MATEO (DIRECCIÓN TÉCNICA) ---
  async getMateoNotes() {
    const defaultNotes = [
      {
        id: 'mateo_note_expo_cierre',
        title: 'Cierre Exitoso Etapa 1 Expo Seguridad e Inicio de Etapa 2',
        project_tag: 'General',
        priority: 'high',
        status: 'resolved',
        content: 'La entrega de la pista (15 de Agosto) y los prototipos v1 (7 de Septiembre) culminó con éxito rotundo en la Expo Seguridad los días 8, 9 y 10 de Septiembre. Todo el balance financiero de la Etapa 1 queda cerrado y archivado. Damos inicio oficial a la Etapa 2: versiones v2 de Skybetol, Skycopter y Skydoc, junto con el nuevo Avión 3D.',
        created_at: '2026-09-10T11:00:00.000Z'
      },
      {
        id: 'mateo_note_hermetico',
        title: 'Decisión Prototipado: Cierre Hermético Skydoc v2',
        project_tag: 'Skydoc',
        priority: 'high',
        status: 'pending',
        content: 'Ver si el cierre hermético lo va a ver Tomás un prototipado rápido o vemos nosotros un prototipado rápido y que Tomás se encargue del definitivo.',
        created_at: '2026-09-10T14:30:00.000Z'
      },
      {
        id: 'mateo_note_skycopter_reimpresion',
        title: 'Validación en Vuelo: Reimpresión 3D Skycopter v2',
        project_tag: 'Skycopter',
        priority: 'medium',
        status: 'pending',
        content: 'Tras el golpe en las pruebas previas y la reconstrucción con reimpresión 3D realizada el 7 de septiembre, coordinar con Renato las pruebas de vibración y resistencia para el 18 de septiembre.',
        created_at: '2026-09-10T15:00:00.000Z'
      },
      {
        id: 'mateo_note_plane3d_cad',
        title: 'Estrategia de Fabricación: Avión Impreso 3D',
        project_tag: 'Avión 3D',
        priority: 'medium',
        status: 'pending',
        content: 'Avanzar en el modelado aerodinámico y segmentación en rodajas para imprimir con filamento ligero LW-PLA. Preparar bancada de motor y timones para octubre.',
        created_at: '2026-09-10T15:30:00.000Z'
      },
      {
        id: 'mateo_note_skyremote_flight',
        title: 'Hito Sky Remote: Mockup de Despegue y Programación UI Web',
        project_tag: 'Sky Remote',
        priority: 'high',
        status: 'resolved',
        content: 'El lunes 7 de septiembre a las 17:00 hrs realizamos con éxito el mockup de vuelo simulando el despegue de Skycopter desde Skydock. Fue una prueba clave que requirió tener ambos prototipos listos y conté con el apoyo en terreno de Renato, Bicho, Roro y Tomás. Esta validación nos permitió obtener la versión demo preliminar requerida para la Expo Seguridad. Durante la noche programé la interfaz web completa para presentar el prototipo de Sky Remote en el stand.',
        created_at: '2026-09-08T03:00:00.000Z'
      },
      {
        id: 'mateo_note_taller_pre_expo',
        title: 'Bitácora de Taller: Fabricación Carcasa Copter, Servos ST3215 y Stickers',
        project_tag: 'General',
        priority: 'high',
        status: 'resolved',
        content: 'Recuento de la intensa semana previa a la Expo:\n• Miércoles 2 Sep: Llegada de piezas 3D (ASA/PLA) del Copter. Limpieza, pegado con gotita, masillado, lijado al agua, pintado de carcasa y ensamble final de la nueva versión (realizado por Mateo).\n• Viernes 4 Sep: Pintado del interior de las cajas del dock y sustitución física por los nuevos servomotores seriales ST3215 (realizado por Mateo).\n• Sábado 5 Sep: Jornada de pegado de stickers a todos los prototipos (Dock: Roro y Liss; Copter: Roro y Liss; Betol: Paula y Roro). Armado del Betol con apoyo de Pablo, Liss y Roro. Programación y calibración de los servos ST3215 del dock (Mateo).',
        created_at: '2026-09-06T00:00:00.000Z'
      },
      {
        id: 'mateo_note_skycopter_radxa_carcasa',
        title: 'Bitácora Skycopter: Cableado Radxa, Testeo e Incidente/Rediseño de Carcasa',
        project_tag: 'Skycopter',
        priority: 'high',
        status: 'resolved',
        content: 'Cronología técnica previa a la Expo (fines de agosto):\n• Viernes 28 Ago: Confección de cableado y conexión entre placa SBC Radxa, cámara y Flight Controller (realizado por Mateo).\n• Sábado 29 Ago: Montaje de la cámara y Radxa en el chasis, comunicación con FC. Jornada completa de testeo en tierra con Renato y grabación del video demostrativo del proyecto.\n• Lunes 31 Ago: Durante la perforación del hoyo para la cámara, se quemó la carcasa. Pablo aprovechó para rediseñar y mejorar la geometría de la carcasa ese mismo día.\n• Martes 1 Sep: Puesta en marcha de la impresión 3D de la nueva estructura, lista para empalmar con la jornada de ensamble del 2 de septiembre.',
        created_at: '2026-09-01T23:00:00.000Z'
      },
      {
        id: 'mateo_note_pablo_pintura_compresor',
        title: 'Reconocimiento Taller: Pintura Fuselaje Betol (Pablo) & Respaldo Compresor (Renato)',
        project_tag: 'Skybetol',
        priority: 'high',
        status: 'resolved',
        content: 'Mucha recompensa y reconocimiento a Pablo por su enorme dedicación en el taller:\n• 27 Ago: Inicio de pruebas de pintura con pistola por gravedad.\n• 3 Sep: Pablo aplicó la primera capa de pintura al fuselaje del Betol. Ese mismo día se averió el compresor y Renato lo reparó con rapidez, salvando la continuidad del proceso.\n• 3 al 5 Sep: Pablo estuvo metido de lleno durante dos o tres días ininterrumpidos entre lijado al agua y sucesivas capas de pintura, logrando el acabado aerodinámico que permitió armar el Betol y colocar los stickers para la feria.',
        created_at: '2026-09-05T20:00:00.000Z'
      },
      {
        id: 'mateo_note_dock_mecanismo_inicial',
        title: 'Evolución Mecánica Skydock: QR Impreso & Descarte de Pistón con Servos',
        project_tag: 'Skydock',
        priority: 'medium',
        status: 'resolved',
        content: 'Hitos iniciales del dock a fines de agosto:\n• Martes 25 Ago: Mateo imprimió el código QR para el marcador visual de aterrizaje.\n• Miércoles 26 Ago: Trabajo intenso para coordinar mecánicamente el pistón con los servomotores originales. Tras las pruebas operativas se determinó que la solución no era suficientemente precisa/robusta, decidiéndose evolucionar a los nuevos servomotores seriales ST3215 instalados el 4 de septiembre.',
        created_at: '2026-08-27T10:00:00.000Z'
      },
      {
        id: 'mateo_note_definicion_demo_cancha',
        title: 'Estrategia Etapa 2: Prioridad Cancha USM (Betol) vs. Evento Expo sin Fecha Fija',
        project_tag: 'General',
        priority: 'high',
        status: 'pending',
        content: 'Definiciones de coordinación hacia adelante:\n1. Evento Exposición USM: No fijar fecha rígida aún. Organizar un evento formal implica permisos, publicidad, horarios y logística que yo no quiero asumir. Si alguien del equipo se postula para organizarlo, se hace; si no, no nos comprometemos con fechas que marean.\n2. Skybetol: Yo (Mateo) armo la electrónica y reconecto todo. La alineación de motores queda abierta para que se postulen los chicos del equipo.\n3. Pruebas en Cancha: El foco técnico real es probar el Betol en la cancha de la universidad. Yo me encargo de gestionar los permisos de la cancha con anticipación para no tener problemas de uso de espacio.',
        created_at: '2026-09-10T21:30:00.000Z'
      }
    ];
    const raw = localStorage.getItem('uavusm_mateo_notes');
    if (!raw) {
      localStorage.setItem('uavusm_mateo_notes', JSON.stringify(defaultNotes));
      return defaultNotes;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map(n => n.id));
        const missingDefaults = defaultNotes.filter(d => !existingIds.has(d.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem('uavusm_mateo_notes', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return defaultNotes;
    } catch {
      return defaultNotes;
    }
  },

  async createMateoNote(noteData) {
    const notes = await this.getMateoNotes();
    const newNote = {
      id: 'mn_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      status: 'pending',
      priority: noteData.priority || 'normal',
      project_tag: noteData.project_tag || 'General',
      ...noteData
    };
    notes.unshift(newNote);
    localStorage.setItem('uavusm_mateo_notes', JSON.stringify(notes));
    return newNote;
  },

  async updateMateoNote(id, noteData) {
    const notes = await this.getMateoNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      notes[idx] = { ...notes[idx], ...noteData, updated_at: new Date().toISOString() };
      localStorage.setItem('uavusm_mateo_notes', JSON.stringify(notes));
      return notes[idx];
    }
    throw new Error('Nota no encontrada');
  },

  async deleteMateoNote(id) {
    const notes = await this.getMateoNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem('uavusm_mateo_notes', JSON.stringify(filtered));
    return true;
  },

  // --- EVENTOS Y CRONOGRAMA ---
  async getEvents() {
    const defaultEvents = [
      {
        id: 'ev_0',
        title: 'Entrega Oficial Pista de Carreras FPV en Tubos PVC',
        start_date: '2026-08-15',
        end_date: '2026-08-15',
        category: 'Hito de Entrega',
        project_id: 'd5555555-5555-5555-5555-555555555555',
        project_name: 'Pista de carreras (Etapa 1)',
        participants: 'Liss y Equipo UAVUSM',
        status: 'completed',
        description: 'Entrega y validación de la pista de carreras en PVC para drones FPV. Proyecto concluido exitosamente el 15 de agosto.'
      },
      {
        id: 'ev_dock_mecanismo_inicial',
        title: 'Impresión de QR & Coordinación Pistón-Servos Skydock',
        start_date: '2026-08-25',
        end_date: '2026-08-26',
        category: 'Taller / Fabricación',
        project_id: 'd1111111-1111-1111-1111-111111111111',
        project_name: 'Skydoc v1',
        participants: 'Mateo y Tomás',
        status: 'completed',
        description: 'Martes 25: Mateo imprime el código QR marcador para el dock. Miércoles 26: Jornada de taller para coordinar el pistón con los servos mecánicos originales (luego descartado para evolucionar a servos ST3215).'
      },
      {
        id: 'ev_pruebas_pistola_gravedad',
        title: 'Primeras Pruebas de Pintura con Pistola por Gravedad',
        start_date: '2026-08-27',
        end_date: '2026-08-27',
        category: 'Taller / Fabricación',
        project_id: 'd2222222-2222-2222-2222-222222222222',
        project_name: 'Skybetol v1',
        participants: 'Pablo y Mateo',
        status: 'completed',
        description: 'Jueves 27: Ensayos preliminares de pulverización y aplicación con pistola de pintura por gravedad en el taller para definir las técnicas de acabado de los fuselajes.'
      },
      {
        id: 'ev_radxa_cableado_testeo',
        title: 'Cableado Radxa, Montaje Cámara, Testeo y Video Skycopter',
        start_date: '2026-08-28',
        end_date: '2026-08-29',
        category: 'Pruebas en Terreno',
        project_id: 'd3333333-3333-3333-3333-333333333333',
        project_name: 'Skycopter v1',
        participants: 'Mateo y Renato',
        status: 'completed',
        description: 'Viernes 28: Mateo realiza el conexionado de la placa SBC Radxa con la cámara y la controladora de vuelo. Sábado 29: Montaje de cámara y Radxa, configuración de comunicación con FC, testeo exhaustivo durante todo el día por Mateo y Renato, y grabación del video demostrativo del proyecto Copter.'
      },
      {
        id: 'ev_incidente_carcasa_redesign',
        title: 'Incidente Carcasa Quemada, Rediseño de Pablo e Impresión 3D',
        start_date: '2026-08-31',
        end_date: '2026-09-01',
        category: 'Taller / Fabricación',
        project_id: 'd3333333-3333-3333-3333-333333333333',
        project_name: 'Skycopter v1',
        participants: 'Pablo, Mateo y Renato',
        status: 'completed',
        description: 'Lunes 31: Mientras Mateo perforaba la carcasa para la cámara, se quemó la estructura. Pablo asumió el rediseño y optimización geométrica ese mismo día. Martes 1 de septiembre: Puesta en marcha de la impresión 3D de la nueva carcasa rediseñada.'
      },
      {
        id: 'ev_copter_v1_assembly',
        title: 'Disponibilidad Piezas 3D & Ensamble Nueva Versión Skycopter',
        start_date: '2026-09-02',
        end_date: '2026-09-02',
        category: 'Taller / Fabricación',
        project_id: 'd3333333-3333-3333-3333-333333333333',
        project_name: 'Skycopter v1',
        participants: 'Mateo (con Renato)',
        status: 'completed',
        description: 'Disponibilidad de impresiones 3D (ASA/PLA). Mateo realiza la limpieza, unión con gotita, masillado, lijado al agua, pintado de la carcasa y ensamble final de la nueva versión del copter.'
      },
      {
        id: 'ev_betol_pintura_compresor',
        title: 'Pintura de Fuselaje Skybetol (Pablo) & Reparación de Compresor (Renato)',
        start_date: '2026-09-03',
        end_date: '2026-09-05',
        category: 'Taller / Fabricación',
        project_id: 'd2222222-2222-2222-2222-222222222222',
        project_name: 'Skybetol v1',
        participants: 'Pablo y Renato',
        status: 'completed',
        description: 'El 3 de septiembre Pablo aplica la primera capa de pintura al fuselaje. Ese mismo día se avería el compresor y Renato lo repara de inmediato. Pablo dedicó 2 a 3 días intensivos de lijado y sucesivas capas de pintura hasta completar el fuselaje el 5 de septiembre.'
      },
      {
        id: 'ev_dock_servos',
        title: 'Pintura Cajas Skydock & Montaje Servos ST3215',
        start_date: '2026-09-04',
        end_date: '2026-09-04',
        category: 'Taller / Fabricación',
        project_id: 'd1111111-1111-1111-1111-111111111111',
        project_name: 'Skydoc v1',
        participants: 'Mateo',
        status: 'completed',
        description: 'Mateo pinta el interior de las cajas del dock y sustituye los servos antiguos por los nuevos servos seriales ST3215 el viernes 4 de septiembre.'
      },
      {
        id: 'ev_1',
        title: 'Jornada de Stickers General, Armado Betol & Programación Servos',
        start_date: '2026-09-05',
        end_date: '2026-09-05',
        category: 'Taller / Fabricación',
        project_id: null,
        project_name: 'Iniciativa UAVUSM (Copter, Dock, Betol)',
        participants: 'Mateo, Roro, Liss, Paula, Pablo',
        status: 'completed',
        description: 'Colocación de stickers a todas las líneas (Dock: Roro y Liss; Copter: Roro y Liss; Betol: Paula y Roro). Armado estructural del Betol apoyado por Pablo, Liss y Roro. Mateo programa y calibra los nuevos servos ST3215 del dock.'
      },
      {
        id: 'ev_fondo_usm',
        title: 'Postulación Concurso Fondo USM (Grabación, Edición y Entrega)',
        start_date: '2026-09-05',
        end_date: '2026-09-07',
        category: 'Fondo Concursable',
        project_id: 'e7777777-7777-7777-7777-777777777777',
        project_name: 'Concurso Fondo USM',
        participants: 'Bicho, Mateo y Equipo UAVUSM',
        status: 'completed',
        description: 'Grabación de video el sábado 5, edición intensiva durante sábado y domingo por Bicho y Mateo, y entrega oficial de postulación el lunes 7 de septiembre. Actualmente en concurso.'
      },
      {
        id: 'ev_2',
        title: 'Entrega Prototipos v1 & Grabación Video Operativo',
        start_date: '2026-09-07',
        end_date: '2026-09-07',
        category: 'Hito de Entrega',
        project_id: 'd1111111-1111-1111-1111-111111111111',
        project_name: 'Skydoc / Skycopter / Skybetol',
        participants: 'Mateo, Renato y Bicho',
        status: 'completed',
        description: 'Entrega oficial de los prototipos v1 (lunes 7 de septiembre). Pruebas operativas del dock en terreno, grabación audiovisual demostrativa y reconstrucción/reimpresión 3D inmediata tras incidente de caída.'
      },
      {
        id: 'ev_skyremote_mockup',
        title: 'Mockup Despegue Copter-Dock & Interfaz Web Sky Remote',
        start_date: '2026-09-07',
        end_date: '2026-09-07',
        category: 'Pruebas en Terreno',
        project_id: 'd4444444-4444-4444-4444-444444444444',
        project_name: 'Sky Remote (Expo Seguridad)',
        participants: 'Mateo, Renato, Bicho, Roro y Tomás',
        status: 'completed',
        description: 'A las 17:00 se realiza el mockup de vuelo con simulación del despegue de Copter desde el Dock con apoyo de todo el equipo, prueba clave para obtener la demo del prototipo. Durante la noche, Mateo programa la interfaz web para la feria.'
      },
      {
        id: 'ev_3',
        title: 'Presentación Oficial en Expo Seguridad 2026',
        start_date: '2026-09-08',
        end_date: '2026-09-10',
        category: 'Feria / Exposición',
        project_id: null,
        project_name: 'Iniciativa UAVUSM',
        participants: 'Equipo UAVUSM',
        status: 'completed',
        description: 'Presentación del stand de UAVUSM exhibiendo los prototipos Skybetol, Skycopter, Skydoc y la versión preliminar de Sky Remote ante empresas, autoridades e instituciones los días 8, 9 y 10 de Septiembre.'
      },
      {
        id: 'ev_4',
        title: 'Ensayos de Vuelo y Validación de Reimpresión Skycopter v2',
        start_date: '2026-09-18',
        end_date: '2026-09-19',
        category: 'Pruebas en Terreno',
        project_id: 'e3333333-3333-3333-3333-333333333333',
        project_name: 'Skycopter v2',
        participants: 'Renato y Mateo',
        status: 'upcoming',
        description: 'Pruebas de resistencia y estabilidad en vuelo con la nueva carcasa inferior reimpresa en 3D.'
      },
      {
        id: 'ev_5',
        title: 'Revisión de Prototipado Rápido Cierre Hermético Skydoc v2',
        start_date: '2026-09-25',
        end_date: '2026-09-26',
        category: 'Hito de Entrega',
        project_id: 'e1111111-1111-1111-1111-111111111111',
        project_name: 'Skydoc v2',
        participants: 'Tomás y Mateo',
        status: 'upcoming',
        description: 'Definición técnica entre prototipado rápido inicial vs. prototipo definitivo de sellado hermético para el SkyDock v2.'
      },
      {
        id: 'ev_6',
        title: 'Hito de Modelado 3D & Primeras Secciones Fuselaje Avión 3D',
        start_date: '2026-10-15',
        end_date: '2026-10-20',
        category: 'Hito de Entrega',
        project_id: 'd6666666-6666-6666-6666-666666666666',
        project_name: 'Avión Impreso en 3D',
        participants: 'Equipo UAVUSM',
        status: 'upcoming',
        description: 'Culminación del modelo aerodinámico CAD y fabricación de las primeras secciones del fuselaje en filamento espumado ligero LW-PLA.'
      },
      {
        id: 'ev_betol_cancha_usm',
        title: 'Prueba de Vuelo Skybetol en Cancha USM (Permisos por Mateo)',
        start_date: '2026-10-17',
        end_date: '2026-10-17',
        category: 'Pruebas en Terreno',
        project_id: 'e2222222-2222-2222-2222-222222222222',
        project_name: 'Skybetol v2',
        participants: 'Mateo y Equipo SkyVTOL',
        status: 'upcoming',
        description: 'Ensayos en terreno de despegue y vuelo VTOL en la cancha de la universidad tras el armado de electrónica por Mateo, alineación de motores y tramitación anticipada de permisos realizada por Mateo.'
      },
      {
        id: 'ev_demo_usm',
        title: 'Exposición / Demostración Interna USM (Fecha TBD • Requiere Voluntario/a para Organización)',
        start_date: '2026-10-31',
        end_date: '2026-10-31',
        category: 'Feria / Exposición',
        project_id: null,
        project_name: 'Iniciativa UAVUSM (Copter + VTOL + Dock + Sky Remote)',
        participants: 'Por Definir (Búsqueda de Encargado de Organización & Permisos)',
        status: 'upcoming',
        description: 'Exposición en vivo ante la comunidad universitaria. Fecha flexible por definir. El equipo técnico prioriza tener los drones y el dock funcionando en la cancha; el evento se realizará si un integrante asume la producción, permisos de espacio y difusión.'
      },
      {
        id: 'ev_7',
        title: 'Cierre de Ciclo Etapa 2 y Vuelos Finales de Validación',
        start_date: '2026-11-30',
        end_date: '2026-11-30',
        category: 'Hito de Entrega',
        project_id: null,
        project_name: 'Iniciativa UAVUSM',
        participants: 'Equipo UAVUSM',
        status: 'upcoming',
        description: 'Evaluación y pruebas de vuelo integradas de las versiones v2 (Skybetol, Skycopter, Skydoc) y prototipo funcional del Avión 3D.'
      },
      {
        id: 'ev_final_marzo_2027',
        title: 'Entrega Final de Proyectos (Ciclo 2027)',
        start_date: '2027-03-31',
        end_date: '2027-03-31',
        category: 'Hito de Entrega',
        project_id: null,
        project_name: 'Iniciativa UAVUSM',
        participants: 'Equipo UAVUSM',
        status: 'upcoming',
        description: 'Culminación definitiva y entrega final de todas las líneas de proyecto con acabado estético completo, pintura final, nuevos stickers y aviónica definitiva.'
      }
    ];

    const raw = localStorage.getItem('uavusm_events');
    if (!raw) {
      localStorage.setItem('uavusm_events', JSON.stringify(defaultEvents));
      return defaultEvents;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map(e => e.id));
        const missingDefaults = defaultEvents.filter(d => !existingIds.has(d.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
          localStorage.setItem('uavusm_events', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return defaultEvents;
    } catch {
      return defaultEvents;
    }
  },

  async createEvent(eventData) {
    const events = await this.getEvents();
    const newEvent = {
      id: 'ev_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      status: eventData.status || 'upcoming',
      ...eventData
    };
    events.push(newEvent);
    localStorage.setItem('uavusm_events', JSON.stringify(events));
    return newEvent;
  },

  async updateEvent(id, eventData) {
    const events = await this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...eventData, updated_at: new Date().toISOString() };
      localStorage.setItem('uavusm_events', JSON.stringify(events));
      return events[idx];
    }
    throw new Error('Evento no encontrado');
  },

  async deleteEvent(id) {
    const events = await this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    localStorage.setItem('uavusm_events', JSON.stringify(filtered));
    return true;
  },

  // --- ENSAYOS (TRIALS) ---
  async getProjectTrials(projectId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('project_trials')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } else {
      const trials = JSON.parse(localStorage.getItem('uavusm_trials') || '[]');
      return trials.find(t => t.project_id === projectId) || null;
    }
  },

  async saveProjectTrials(projectId, trialData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('project_trials')
        .upsert({
          project_id: projectId,
          columns: trialData.columns,
          rows: trialData.rows,
          cells: trialData.cells,
          updated_at: new Date().toISOString()
        }, { onConflict: 'project_id' })
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const trials = JSON.parse(localStorage.getItem('uavusm_trials') || '[]');
      const index = trials.findIndex(t => t.project_id === projectId);
      const updatedTrial = {
        project_id: projectId,
        columns: trialData.columns,
        rows: trialData.rows,
        cells: trialData.cells,
        updated_at: new Date().toISOString()
      };
      if (index !== -1) {
        trials[index] = { ...trials[index], ...updatedTrial };
      } else {
        updatedTrial.id = 't_' + Math.random().toString(36).substr(2, 9);
        updatedTrial.created_at = new Date().toISOString();
        trials.push(updatedTrial);
      }
      localStorage.setItem('uavusm_trials', JSON.stringify(trials));
      return updatedTrial;
    }
  },

  // --- SUBIDA DE ARCHIVOS (Imágenes y Documentación) ---
  async uploadFile(file, folder = 'misc') {
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random().toString(36).substr(2, 9)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('uavusm-files')
        .upload(filePath, file);

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('uavusm-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } else {
      // Modo LocalStorage: Convertir a Base64 para simular almacenamiento persistente
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Guardamos en localStorage si el archivo no supera cierto tamaño razonable (~1.5MB)
          // Si es muy grande, de todas formas lo convertimos a objeto URL temporal del navegador
          if (file.size > 1.5 * 1024 * 1024) {
            console.warn('El archivo es demasiado grande para guardarse de forma permanente en LocalStorage. Se usará un enlace temporal de sesión.');
            resolve(URL.createObjectURL(file));
          } else {
            resolve(reader.result);
          }
        };
        reader.onerror = error => reject(error);
      });
    }
  },

  // --- DISPONIBILIDAD SEMANAL DEL EQUIPO ---
  async getTeamAvailability(semester = '2026-2') {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team_availability')
          .select('*')
          .eq('semester', semester);

        if (!error && data && data.length > 0) {
          const formatted = {};
          data.forEach(item => {
            if (!formatted[item.member_id]) formatted[item.member_id] = {};
            formatted[item.member_id][item.week_number] = {
              level: item.level,
              notes: item.notes || '',
              updated_at: item.updated_at
            };
          });
          return formatted;
        }
      } catch (e) {
        console.warn('Could not read team_availability from Supabase, using local:', e);
      }
    }

    try {
      const all = JSON.parse(localStorage.getItem('uavusm_availability') || '{}');
      return all[semester] || {};
    } catch (e) {
      return {};
    }
  },

  async saveMemberAvailability(memberId, weekNumber, data, semester = '2026-2') {
    let all = {};
    try {
      all = JSON.parse(localStorage.getItem('uavusm_availability') || '{}');
    } catch (e) {
      all = {};
    }
    if (!all[semester]) all[semester] = {};
    if (!all[semester][memberId]) all[semester][memberId] = {};

    if (!data || !data.level) {
      delete all[semester][memberId][weekNumber];
    } else {
      all[semester][memberId][weekNumber] = {
        level: data.level,
        notes: data.notes || '',
        updated_at: new Date().toISOString()
      };
    }
    localStorage.setItem('uavusm_availability', JSON.stringify(all));

    if (isSupabaseConfigured) {
      try {
        if (!data || !data.level) {
          await supabase.from('team_availability')
            .delete()
            .eq('member_id', memberId)
            .eq('semester', semester)
            .eq('week_number', Number(weekNumber));
        } else {
          await supabase.from('team_availability').upsert({
            member_id: memberId,
            semester: semester,
            week_number: Number(weekNumber),
            level: data.level,
            notes: data.notes || '',
            updated_at: new Date().toISOString()
          }, { onConflict: 'member_id,semester,week_number' });
        }
      } catch (err) {
        console.warn('Could not sync availability to Supabase:', err);
      }
    }

    return all[semester];
  },

  async saveMemberFullSemesterAvailability(memberId, weeksData, semester = '2026-2') {
    let all = {};
    try {
      all = JSON.parse(localStorage.getItem('uavusm_availability') || '{}');
    } catch (e) {
      all = {};
    }
    // Limpiar para guardar solo semanas que tengan un nivel definido
    const cleaned = {};
    Object.entries(weeksData || {}).forEach(([k, v]) => {
      if (v && v.level) {
        cleaned[k] = {
          level: v.level,
          notes: v.notes || '',
          updated_at: new Date().toISOString()
        };
      }
    });

    if (!all[semester]) all[semester] = {};
    all[semester][memberId] = cleaned;
    localStorage.setItem('uavusm_availability', JSON.stringify(all));

    if (isSupabaseConfigured) {
      try {
        const rows = Object.entries(cleaned).map(([weekNum, val]) => ({
          member_id: memberId,
          semester: semester,
          week_number: Number(weekNum),
          level: val.level,
          notes: val.notes || '',
          updated_at: val.updated_at
        }));
        if (rows.length > 0) {
          await supabase.from('team_availability').upsert(rows, { onConflict: 'member_id,semester,week_number' });
        }
      } catch (err) {
        console.warn('Could not sync full availability to Supabase:', err);
      }
    }

    return all[semester];
  },

  // --- MÓDULO DE RENDICIONES Y REEMBOLSOS (SKYDRONE SpA - MATEO & NICOLÁS) ---
  async getRendicionesData() {
    const raw = localStorage.getItem('uavusm_rendiciones');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.gastos)) {
          return parsed;
        }
      } catch (e) {
        console.warn('Error parseando uavusm_rendiciones de localStorage:', e);
      }
    }

    // Inicializar desde /rendiciones/rendiciones.json si existe o usar seed inicial
    try {
      const res = await fetch('/rendiciones/rendiciones.json');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('uavusm_rendiciones', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Fetch fallback para rendiciones.json:', e);
    }

    const defaultRendiciones = {
      proyecto: "Skydrone SpA - Compras y Rendiciones",
      descripcion: "Registro de gastos, boletas, rendiciones y transferencias de Skydrone SpA.",
      cortes: [
        {
          id: "corte-1",
          fecha: "2026-08-28",
          titulo: "Rendición Lote 1 (Agosto Expo)",
          gastoIds: ["g-3", "g-2", "g-4", "g-1"],
          montoTotal: 219176,
          estado: "PAGADO",
          transferenciaId: "t-1",
          notas: "Corte realizado y cubierto con transferencia de $220.000 del 28/08/2026."
        }
      ],
      gastos: [
        {
          id: "g-1",
          fecha: "2026-08-24",
          hora: "12:17:48",
          proveedor: "Sodimac",
          items: [
            { codigo: "1611895", descripcion: "AEROGRAFO 8PZAS INDURA", cantidad: 1, total: 31924 },
            { codigo: "896675", descripcion: "AGUA DESMINERALIZADA 5L", cantidad: 1, total: 2353 },
            { codigo: "160717", descripcion: "PLACA MDF DESNUDO 3MM 152X244", cantidad: 2, total: 17059 }
          ],
          monto: 61090,
          archivo: "/rendiciones/boletas/boleta_2026-08-24_sodimac_61090.png",
          estado: "PAGADO",
          rendido: true,
          corteId: "corte-1",
          transferenciaId: "t-1",
          notas: "Parte del pago de $220.000 del 28/08/2026."
        },
        {
          id: "g-2",
          fecha: "2026-08-21",
          hora: "13:51:08",
          proveedor: "Pinturas Motta SpA",
          rut: "76.638.967-8",
          direccion: "Calle Monjitas 359, Santiago",
          items: [
            { codigo: "COMPROBANTE 022922", descripcion: "Pinturas / Insumos de pintura", cantidad: 1, total: 11400 }
          ],
          monto: 11400,
          archivo: "/rendiciones/boletas/boleta_2026-08-21_pinturas_motta_11400.png",
          estado: "PAGADO",
          rendido: true,
          corteId: "corte-1",
          transferenciaId: "t-1",
          notas: "Parte del pago de $220.000 del 28/08/2026."
        },
        {
          id: "g-3",
          fecha: "2026-08-20",
          proveedor: "AliExpress",
          items: [
            { tienda: "StarWing Store Store", ref: "8213986284482066", descripcion: "HQProp 8X3.7X3 3-Blade Polycarbonate Propeller 5mm Shaft", total: 6088 },
            { tienda: "Flyhike Official Store", ref: "8213986284502066", descripcion: "2Pair Gemfan Vortex 8X4 Propeller Gray Glass Fiber Nylon", total: 8245 },
            { tienda: "Shop1105024031 Store", ref: "8213986284522066", descripcion: "2 Pairs Gemfan 8040 8x4x3 3-Bladed 8-Inch Propellers (4 PCS-2CW-2CCW-8040)", total: 7548 }
          ],
          monto: 21881,
          archivo: "/rendiciones/boletas/comprobante_2026-08-20_aliexpress_helices_21881.png",
          estado: "PAGADO",
          rendido: true,
          corteId: "corte-1",
          transferenciaId: "t-1",
          notas: "Compras hélices AliExpress. Parte del pago de $220.000 del 28/08/2026."
        },
        {
          id: "g-4",
          fecha: "2026-08-22",
          proveedor: "AliExpress",
          items: [
            { tienda: "stemedu Official Store", ref: "8213403442572066", descripcion: "Feetech STS3215 12V 30KG High Precision Feedback Servo (2 pcs)", total: 87582 },
            { tienda: "Beautiful Beautiful bag Store", ref: "8213403442592066", descripcion: "ABQR DC 12V Waterproof IP54 Mini Linear Actuator 100 mm Stroke (2 pcs)", total: 37223 }
          ],
          monto: 124805,
          archivo: "/rendiciones/boletas/comprobante_2026-08-22_aliexpress_servos_actuadores.png",
          estado: "PAGADO",
          rendido: true,
          corteId: "corte-1",
          transferenciaId: "t-1",
          notas: "Servos 30KG y Actuadores lineales. Parte del pago de $220.000 del 28/08/2026."
        },
        {
          id: "g-5",
          fecha: "2026-08-24",
          proveedor: "MercadoLibre",
          items: [
            { codigo: "#175502767594", descripcion: "Pistola De Pintura De Aire H.v.l.p 1.0 (Naranja)", total: 14600 },
            { codigo: "#175502767594", descripcion: "Regulador Presion De Aire Para Pistola", total: 13575 }
          ],
          monto: 31165,
          archivo: "/rendiciones/boletas/comprobante_2026-08-24_mercadolibre_pistola_aire_31165.png",
          estado: "PENDIENTE_PAGO",
          rendido: false,
          corteId: null,
          transferenciaId: null,
          notas: "Pistola de pintura y regulador de presión. Falta que lo paguen."
        },
        {
          id: "g-6",
          fecha: "2026-08-27",
          proveedor: "MercadoLibre",
          items: [
            { codigo: "#175828963476", descripcion: "Primer Automotriz Rust-oleum 2 En 1", total: 16140 },
            { codigo: "#175828963476", descripcion: "Masilla Poliester Star Light Sherwin Williams", total: 8500 },
            { codigo: "#175828963476", descripcion: "Espátulas Carroceras Hela 4 Pzas", total: 6780 }
          ],
          monto: 38500,
          archivo: "/rendiciones/boletas/comprobante_2026-08-27_mercadolibre_masilla_primer_38500.png",
          estado: "PENDIENTE_PAGO",
          rendido: false,
          corteId: null,
          transferenciaId: null,
          notas: "Primer automotriz, masilla poliéster y espátulas carroceras. Falta que lo paguen."
        },
        {
          id: "g-7",
          fecha: "2026-08-28",
          hora: "13:35:22",
          proveedor: "Pinturas Motta SpA",
          rut: "76.638.967-8",
          direccion: "Calle Monjitas 359, Santiago",
          items: [
            { codigo: "COMPROBANTE 023003", descripcion: "Pintura / Insumos", cantidad: 1, total: 32000 }
          ],
          monto: 32000,
          archivo: "/rendiciones/boletas/boleta_2026-08-28_pinturas_motta_32000.png",
          estado: "PENDIENTE_PAGO",
          rendido: false,
          corteId: null,
          transferenciaId: null,
          notas: "Compra de pintura en Pinturas Motta (28/08 13:35 hrs). Falta que lo paguen."
        },
        {
          id: "g-8",
          fecha: "2026-08-24",
          proveedor: "Bencina / Traslado",
          items: [
            { descripcion: "Combustible traslado en vehículo para transportar planchas de MDF", total: 10000 }
          ],
          monto: 10000,
          archivo: null,
          estado: "PENDIENTE_PAGO",
          rendido: false,
          corteId: null,
          transferenciaId: null,
          notas: "Se fue en vehículo para poder llevar las planchas de MDF."
        },
        {
          id: "g-9",
          fecha: "2026-08-29",
          proveedor: "Bencina / Traslado",
          items: [
            { descripcion: "Combustible traslado en vehículo para llevar dock y avanzar el fin de semana", total: 10000 }
          ],
          monto: 10000,
          archivo: null,
          estado: "PENDIENTE_PAGO",
          rendido: false,
          corteId: null,
          transferenciaId: null,
          notas: "Se fue en vehículo para poder llevarse el dock para avanzar el fin de semana."
        }
      ],
      transferencias: [
        {
          id: "t-1",
          fecha: "2026-08-28",
          hora: "17:58",
          emisor: "Skydrone SpA",
          rut: "76.991.046-8",
          monto: 220000,
          nOperacion: "6032572678",
          archivo: "/rendiciones/boletas/transferencia_2026-08-28_220000.png",
          montoAsignado: 219176,
          montoPorAsignar: 824
        }
      ],
      totales: {
        totalGastado: 340841.0,
        totalReembolsado: 220000,
        saldoPendientePorCobrar: 121665.0
      }
    };

    localStorage.setItem('uavusm_rendiciones', JSON.stringify(defaultRendiciones));
    return defaultRendiciones;
  },

  async saveRendicionesData(data) {
    // Recalcular métricas de totales
    const totalGastado = (data.gastos || []).reduce((acc, g) => acc + (Number(g.monto) || 0), 0);
    const totalReembolsado = (data.transferencias || []).reduce((acc, t) => acc + (Number(t.monto) || 0), 0);
    const saldoPendientePorCobrar = Math.max(0, totalGastado - totalReembolsado);

    const updated = {
      ...data,
      totales: {
        totalGastado,
        totalReembolsado,
        saldoPendientePorCobrar
      }
    };

    localStorage.setItem('uavusm_rendiciones', JSON.stringify(updated));
    return updated;
  },

  async addGastoRendicion(nuevoGasto) {
    const data = await this.getRendicionesData();
    const gasto = {
      id: 'g-' + (Date.now().toString(36)),
      fecha: nuevoGasto.fecha || new Date().toISOString().split('T')[0],
      hora: nuevoGasto.hora || new Date().toLocaleTimeString('es-CL'),
      proveedor: nuevoGasto.proveedor || 'Proveedor Varios',
      monto: Number(nuevoGasto.monto) || 0,
      items: nuevoGasto.items || [{ descripcion: nuevoGasto.proveedor, total: Number(nuevoGasto.monto) || 0 }],
      archivo: nuevoGasto.archivo || null,
      estado: 'PENDIENTE_PAGO',
      rendido: false,
      corteId: null,
      transferenciaId: null,
      notas: nuevoGasto.notas || ''
    };

    data.gastos.push(gasto);
    return await this.saveRendicionesData(data);
  },

  async createCorteRendicion({ titulo, notas, gastoIds = [] }) {
    const data = await this.getRendicionesData();
    // Si no se especifican IDs, agrupar todos los gastos no rendidos
    const targetIds = gastoIds.length > 0 
      ? new Set(gastoIds)
      : new Set(data.gastos.filter(g => !g.rendido).map(g => g.id));

    const gastosSeleccionados = data.gastos.filter(g => targetIds.has(g.id));
    const montoTotal = gastosSeleccionados.reduce((sum, g) => sum + (Number(g.monto) || 0), 0);

    const corteId = 'corte-' + Date.now();
    const nuevoCorte = {
      id: corteId,
      fecha: new Date().toISOString().split('T')[0],
      titulo: titulo || `Rendición formal (${new Date().toLocaleDateString('es-CL')})`,
      gastoIds: Array.from(targetIds),
      montoTotal,
      estado: 'RENDIDO_PENDIENTE_PAGO',
      transferenciaId: null,
      notas: notas || 'Rendición ingresada para revisión y reembolso por Skydrone SpA.'
    };

    if (!data.cortes) data.cortes = [];
    data.cortes.push(nuevoCorte);

    // Marcar los gastos como rendidos y asociarlos a este corte
    data.gastos = data.gastos.map(g => {
      if (targetIds.has(g.id)) {
        return {
          ...g,
          rendido: true,
          corteId: corteId
        };
      }
      return g;
    });

    return await this.saveRendicionesData(data);
  },

  async registerPagoSkydrone({ monto, nOperacion, archivo, fecha, corteId, notas }) {
    const data = await this.getRendicionesData();
    const transfId = 't-' + Date.now();
    const montoNum = Number(monto) || 0;

    const nuevaTransf = {
      id: transfId,
      fecha: fecha || new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-CL'),
      emisor: 'Skydrone SpA',
      rut: '76.991.046-8',
      monto: montoNum,
      nOperacion: nOperacion || `OP-${Date.now().toString().slice(-6)}`,
      archivo: archivo || null,
      corteId: corteId || null,
      notas: notas || ''
    };

    if (!data.transferencias) data.transferencias = [];
    data.transferencias.push(nuevaTransf);

    // Si se asoció a un corte, marcar el corte y sus gastos como PAGADOS
    if (corteId && data.cortes) {
      const corteIdx = data.cortes.findIndex(c => c.id === corteId);
      if (corteIdx !== -1) {
        data.cortes[corteIdx].estado = 'PAGADO';
        data.cortes[corteIdx].transferenciaId = transfId;

        const idsEnCorte = new Set(data.cortes[corteIdx].gastoIds || []);
        data.gastos = data.gastos.map(g => {
          if (idsEnCorte.has(g.id)) {
            return {
              ...g,
              estado: 'PAGADO',
              transferenciaId: transfId
            };
          }
          return g;
        });
      }
    }

    return await this.saveRendicionesData(data);
  }
};
