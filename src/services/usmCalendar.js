// ====================================================================
// UAVUSM - Calendario Académico USM 2026-2 & Hitos Oficiales
// Filtrado exclusivo: días sin clases, recesos, colchón, inicio y fin.
// ====================================================================

export const USM_SEMESTER_INFO = {
  semester: '2026-2',
  title: 'Segundo Semestre Académico 2026',
  startDate: '2026-08-03',
  endDate: '2026-12-04',
  examStartDate: '2026-12-09',
  examEndDate: '2026-12-11',
  summerVacationDate: '2027-01-25'
};

// Niveles de Disponibilidad para el Equipo UAVUSM (5 niveles solicitados)
export const AVAILABILITY_LEVELS = {
  very_high: {
    id: 'very_high',
    label: 'Muy Alta',
    shortLabel: 'Muy Alta',
    hours: '12+ hrs',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    icon: '🟢',
    levelNum: 5,
    description: 'Máxima disponibilidad, tiempo libre para taller y proyectos'
  },
  high: {
    id: 'high',
    label: 'Alta',
    shortLabel: 'Alta',
    hours: '8 - 12 hrs',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(34, 197, 94, 0.45)',
    icon: '🟢',
    levelNum: 4,
    description: 'Buen tiempo disponible para apoyar en avances y pruebas'
  },
  medium: {
    id: 'medium',
    label: 'Media',
    shortLabel: 'Media',
    hours: '4 - 8 hrs',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.18)',
    borderColor: 'rgba(234, 179, 8, 0.45)',
    icon: '🟡',
    levelNum: 3,
    description: 'Carga normal de clases, apoyo regular en tareas y reuniones'
  },
  low: {
    id: 'low',
    label: 'Baja',
    shortLabel: 'Baja',
    hours: '2 - 4 hrs',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.18)',
    borderColor: 'rgba(249, 115, 22, 0.45)',
    icon: '🟠',
    levelNum: 2,
    description: 'Poco tiempo, certámenes o entregas de ramos en camino'
  },
  minimal: {
    id: 'minimal',
    label: 'Mínima',
    shortLabel: 'Mínima',
    hours: '0 - 2 hrs',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: 'rgba(239, 68, 68, 0.45)',
    icon: '🔴',
    levelNum: 1,
    description: 'Semana colapsada de certámenes, foco 100% en ramos'
  }
};

// Array ordenado de niveles
export const AVAILABILITY_LEVELS_ARRAY = [
  AVAILABILITY_LEVELS.very_high,
  AVAILABILITY_LEVELS.high,
  AVAILABILITY_LEVELS.medium,
  AVAILABILITY_LEVELS.low,
  AVAILABILITY_LEVELS.minimal
];

// Eventos oficiales USM para marcar en el calendario (días sin clases, recesos, colchón, inicio y fin)
export const OFFICIAL_USM_EVENTS = [
  { date: '2026-08-03', title: 'Inicio de Clases 2026-2', icon: '🚀', color: '#10b981' },
  { date: '2026-09-14', title: 'Receso Fiestas Patrias (Sin clases)', icon: '🇨🇱', color: '#f59e0b' },
  { date: '2026-09-15', title: 'Receso Fiestas Patrias (Sin clases)', icon: '🇨🇱', color: '#f59e0b' },
  { date: '2026-09-16', title: 'Receso Fiestas Patrias (Sin clases)', icon: '🇨🇱', color: '#f59e0b' },
  { date: '2026-09-17', title: 'Receso Fiestas Patrias (Sin clases)', icon: '🇨🇱', color: '#f59e0b' },
  { date: '2026-09-18', title: 'Feriado Fiestas Patrias', icon: '🇨🇱', color: '#f59e0b' },
  { date: '2026-09-21', title: 'Colchón Académico (Sin evaluaciones)', icon: '🛡️', color: '#0ea5e9' },
  { date: '2026-09-22', title: 'Colchón Académico (Sin evaluaciones)', icon: '🛡️', color: '#0ea5e9' },
  { date: '2026-10-12', title: 'Feriado Encuentro de Dos Mundos', icon: '📅', color: '#a855f7' },
  { date: '2026-10-14', title: 'Puertas Abiertas USM (Tardes sin clases)', icon: '🏛️', color: '#06b6d4' },
  { date: '2026-10-15', title: 'Puertas Abiertas USM', icon: '🏛️', color: '#06b6d4' },
  { date: '2026-10-16', title: 'Puertas Abiertas USM', icon: '🏛️', color: '#06b6d4' },
  { date: '2026-10-17', title: 'Puertas Abiertas USM', icon: '🏛️', color: '#06b6d4' },
  { date: '2026-10-31', title: 'Feriado Iglesias Evangélicas', icon: '📅', color: '#64748b' },
  { date: '2026-11-01', title: 'Feriado Todos los Santos', icon: '📅', color: '#64748b' },
  { date: '2026-12-04', title: 'Fin de Clases 2026-2', icon: '🏁', color: '#10b981' },
  { date: '2026-12-07', title: 'Suspensión Académica USM', icon: '📅', color: '#64748b' },
  { date: '2026-12-08', title: 'Feriado Inmaculada Concepción', icon: '📅', color: '#64748b' },
  { date: '2026-12-09', title: 'Exámenes Finales', icon: '📝', color: '#ef4444' },
  { date: '2026-12-10', title: 'Exámenes Finales', icon: '📝', color: '#ef4444' },
  { date: '2026-12-11', title: 'Exámenes Finales', icon: '📝', color: '#ef4444' }
];

export const EVENTS_BY_DATE = OFFICIAL_USM_EVENTS.reduce((acc, ev) => {
  acc[ev.date] = ev;
  return acc;
}, {});

// Meses del segundo semestre académico 2026
export const SEMESTER_CALENDAR_MONTHS = [
  { id: 'aug', year: 2026, monthIndex: 7, name: 'agosto 2026', title: 'Agosto 2026' },
  { id: 'sep', year: 2026, monthIndex: 8, name: 'septiembre 2026', title: 'Septiembre 2026' },
  { id: 'oct', year: 2026, monthIndex: 9, name: 'octubre 2026', title: 'Octubre 2026' },
  { id: 'nov', year: 2026, monthIndex: 10, name: 'noviembre 2026', title: 'Noviembre 2026' },
  { id: 'dec', year: 2026, monthIndex: 11, name: 'diciembre 2026', title: 'Diciembre 2026' }
];

// Helper para obtener los 7 días de una semana específica
export function getDaysForWeek(weekObj) {
  const days = [];
  const start = new Date(weekObj.startDate + 'T00:00:00');
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const todayIso = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    days.push({
      dateIso: iso,
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      monthNumber: d.getMonth() + 1,
      isToday: iso === todayIso
    });
  }
  return days;
}

// Generador de semanas y días para la vista de calendario clásico
export function generateMonthWeeks(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  
  // Lunes = 0, ..., Domingo = 6
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  
  const currentMonday = new Date(firstDay);
  currentMonday.setDate(firstDay.getDate() - startDayOfWeek);
  
  const todayIso = new Date().toISOString().split('T')[0];
  const weeks = [];
  
  while (currentMonday <= lastDay || currentMonday.getMonth() === monthIndex) {
    const yyyy = currentMonday.getFullYear();
    const mm = String(currentMonday.getMonth() + 1).padStart(2, '0');
    const dd = String(currentMonday.getDate()).padStart(2, '0');
    const mondayIso = `${yyyy}-${mm}-${dd}`;
    
    const weekObj = SEMESTER_WEEKS_2026_2.find(w => w.startDate === mondayIso);
    const weekNumber = weekObj ? weekObj.weekNumber : null;
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      const dY = d.getFullYear();
      const dM = String(d.getMonth() + 1).padStart(2, '0');
      const dD = String(d.getDate()).padStart(2, '0');
      const iso = `${dY}-${dM}-${dD}`;
      const isCurrentMonth = d.getMonth() === monthIndex;
      const isToday = iso === todayIso;
      const event = EVENTS_BY_DATE[iso] || null;

      days.push({
        dateIso: iso,
        dayNumber: d.getDate(),
        isCurrentMonth,
        isToday,
        isWeekend: i >= 5,
        event
      });
    }
    
    if (weekNumber !== null) {
      weeks.push({
        weekNumber,
        mondayIso,
        weekObj,
        days
      });
    }
    
    currentMonday.setDate(currentMonday.getDate() + 7);
    if (currentMonday > lastDay && currentMonday.getMonth() !== monthIndex) {
      break;
    }
  }
  
  return weeks;
}

// Semanas del Semestre 2026-2 con Hitos Oficiales Esenciales USM
// (Solo días sin clases, recesos, vacaciones, colchón, inicio y fin)
export const SEMESTER_WEEKS_2026_2 = [
  {
    weekNumber: 1,
    startDate: '2026-08-03',
    endDate: '2026-08-09',
    label: 'Semana 1',
    dateRange: '03 Ago - 09 Ago',
    milestones: [
      {
        type: 'start',
        title: 'Inicio de Clases (03 Ago)',
        desc: 'Inicio del 2° Semestre 2026.',
        icon: '🚀',
        color: '#10b981'
      }
    ]
  },
  {
    weekNumber: 2,
    startDate: '2026-08-10',
    endDate: '2026-08-16',
    label: 'Semana 2',
    dateRange: '10 Ago - 16 Ago',
    milestones: []
  },
  {
    weekNumber: 3,
    startDate: '2026-08-17',
    endDate: '2026-08-23',
    label: 'Semana 3',
    dateRange: '17 Ago - 23 Ago',
    milestones: []
  },
  {
    weekNumber: 4,
    startDate: '2026-08-24',
    endDate: '2026-08-30',
    label: 'Semana 4',
    dateRange: '24 Ago - 30 Ago',
    milestones: []
  },
  {
    weekNumber: 5,
    startDate: '2026-08-31',
    endDate: '2026-09-06',
    label: 'Semana 5',
    dateRange: '31 Ago - 06 Sep',
    milestones: []
  },
  {
    weekNumber: 6,
    startDate: '2026-09-07',
    endDate: '2026-09-13',
    label: 'Semana 6',
    dateRange: '07 Sep - 13 Sep',
    isCurrent: true,
    milestones: []
  },
  {
    weekNumber: 7,
    startDate: '2026-09-14',
    endDate: '2026-09-20',
    label: 'Semana 7',
    dateRange: '14 Sep - 20 Sep',
    isVacation: true,
    milestones: [
      {
        type: 'vacation',
        title: 'Vacaciones Fiestas Patrias (14-18 Sep)',
        desc: 'Semana de receso institucional USM. Sin clases ni actividades.',
        icon: '🇨🇱',
        color: '#f59e0b'
      }
    ]
  },
  {
    weekNumber: 8,
    startDate: '2026-09-21',
    endDate: '2026-09-27',
    label: 'Semana 8',
    dateRange: '21 Sep - 27 Sep',
    milestones: [
      {
        type: 'recess',
        title: 'Colchón Académico (21-22 Sep)',
        desc: 'Días protegidos post-vacaciones: sin certámenes ni entregas.',
        icon: '🛡️',
        color: '#0ea5e9'
      }
    ]
  },
  {
    weekNumber: 9,
    startDate: '2026-09-28',
    endDate: '2026-10-04',
    label: 'Semana 9',
    dateRange: '28 Sep - 04 Oct',
    milestones: []
  },
  {
    weekNumber: 10,
    startDate: '2026-10-05',
    endDate: '2026-10-11',
    label: 'Semana 10',
    dateRange: '05 Oct - 11 Oct',
    milestones: []
  },
  {
    weekNumber: 11,
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    label: 'Semana 11',
    dateRange: '12 Oct - 18 Oct',
    milestones: [
      {
        type: 'holiday',
        title: 'Feriado 12 Oct & Puertas Abiertas (14-17 Oct)',
        desc: 'Feriado lunes 12. Puertas Abiertas sin evaluaciones y tardes libres.',
        icon: '🏛️',
        color: '#a855f7'
      }
    ]
  },
  {
    weekNumber: 12,
    startDate: '2026-10-19',
    endDate: '2026-10-25',
    label: 'Semana 12',
    dateRange: '19 Oct - 25 Oct',
    milestones: []
  },
  {
    weekNumber: 13,
    startDate: '2026-10-26',
    endDate: '2026-11-01',
    label: 'Semana 13',
    dateRange: '26 Oct - 01 Nov',
    milestones: [
      {
        type: 'holiday',
        title: 'Feriado Nacional (31 Oct - 01 Nov)',
        desc: 'Fin de semana largo (Día Iglesias Evangélicas / Todos los Santos).',
        icon: '📅',
        color: '#64748b'
      }
    ]
  },
  {
    weekNumber: 14,
    startDate: '2026-11-02',
    endDate: '2026-11-08',
    label: 'Semana 14',
    dateRange: '02 Nov - 08 Nov',
    milestones: []
  },
  {
    weekNumber: 15,
    startDate: '2026-11-09',
    endDate: '2026-11-15',
    label: 'Semana 15',
    dateRange: '09 Nov - 15 Nov',
    milestones: []
  },
  {
    weekNumber: 16,
    startDate: '2026-11-16',
    endDate: '2026-11-22',
    label: 'Semana 16',
    dateRange: '16 Nov - 22 Nov',
    milestones: []
  },
  {
    weekNumber: 17,
    startDate: '2026-11-23',
    endDate: '2026-11-29',
    label: 'Semana 17',
    dateRange: '23 Nov - 29 Nov',
    milestones: []
  },
  {
    weekNumber: 18,
    startDate: '2026-11-30',
    endDate: '2026-12-06',
    label: 'Semana 18',
    dateRange: '30 Nov - 06 Dic',
    milestones: [
      {
        type: 'end',
        title: 'Fin de Clases (04 Dic)',
        desc: 'Término oficial de clases del 2° Semestre 2026.',
        icon: '🏁',
        color: '#10b981'
      }
    ]
  },
  {
    weekNumber: 19,
    startDate: '2026-12-07',
    endDate: '2026-12-13',
    label: 'Semana 19',
    dateRange: '07 Dic - 13 Dic',
    milestones: [
      {
        type: 'exams',
        title: 'Exámenes Finales (09-11 Dic)',
        desc: '07 Dic suspensión, 08 Dic feriado, 09-11 Dic periodo de exámenes.',
        icon: '📝',
        color: '#ef4444'
      }
    ]
  },
  {
    weekNumber: 20,
    startDate: '2026-12-14',
    endDate: '2026-12-20',
    label: 'Semana 20',
    dateRange: '14 Dic - 20 Dic',
    milestones: []
  }
];

/**
 * Obtiene el número de semana actual del semestre según la fecha de hoy
 */
export function getCurrentSemesterWeek() {
  // Fecha actual del sistema (10 Septiembre 2026) -> Semana 6
  const now = new Date();
  const currentIso = now.toISOString().split('T')[0];

  for (const week of SEMESTER_WEEKS_2026_2) {
    if (currentIso >= week.startDate && currentIso <= week.endDate) {
      return week.weekNumber;
    }
  }

  // Fallback razonable: semana 6 (semana del 10 de Septiembre 2026)
  return 6;
}

/**
 * Obtiene la lista completa de hitos importantes del semestre
 */
export function getAllMilestones() {
  const list = [];
  SEMESTER_WEEKS_2026_2.forEach(w => {
    w.milestones.forEach(m => {
      list.push({
        ...m,
        weekNumber: w.weekNumber,
        dateRange: w.dateRange
      });
    });
  });
  return list;
}
