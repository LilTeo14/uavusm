import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Users, ArrowRight, ChevronLeft, ChevronRight,
  Filter, Check, X, Paintbrush, Sparkles, Save, CheckCircle2,
  AlertTriangle, CalendarDays
} from 'lucide-react';
import { 
  SEMESTER_WEEKS_2026_2, 
  AVAILABILITY_LEVELS, 
  AVAILABILITY_LEVELS_ARRAY,
  SEMESTER_CALENDAR_MONTHS,
  generateMonthWeeks,
  getCurrentSemesterWeek,
  OFFICIAL_USM_EVENTS
} from '../services/usmCalendar';
import { TEAM_MEMBERS, getTeamMember } from '../services/team';
import { dbService } from '../services/db';

export default function AvailabilityView({ currentProfile, isAdmin }) {
  const currentWeekNum = getCurrentSemesterWeek();
  const isGuest = !currentProfile || currentProfile === 'guest';

  // Pestaña principal: si es visita, por defecto 'team-summary'; si es integrante, 'my-calendar'
  const [activeTab, setActiveTab] = useState(isGuest ? 'team-summary' : 'my-calendar');

  // Miembro seleccionado para el calendario
  const [selectedMemberId, setSelectedMemberId] = useState(() => {
    return (!isGuest) ? currentProfile : 'mateo';
  });

  // Datos globales de disponibilidad
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Buffer de edición para el calendario del miembro
  const [draftWeeks, setDraftWeeks] = useState({});

  // Color / Pincel activo seleccionado para pintar semanas (por defecto 'high')
  const [activeBrush, setActiveBrush] = useState('high'); // 'very_high' | 'high' | 'medium' | 'low' | 'minimal' | 'clear'

  // Modo de visualización de meses: '3-months' (3 meses) | '4-months' (4 meses) | 'all' (5 meses con agosto)
  const [monthViewMode, setMonthViewMode] = useState('3-months');
  // Índice inicial de mes para la navegación (por defecto 1 = septiembre)
  const [startMonthIndex, setStartMonthIndex] = useState(1); // 0: Ago, 1: Sep, 2: Oct, 3: Nov, 4: Dic

  // Filtro de semanas en el resumen del equipo
  const [summaryUpcomingOnly, setSummaryUpcomingOnly] = useState(true);

  // Cargar datos desde DB
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dbService.getTeamAvailability('2026-2');
      setAvailabilityData(data || {});
    } catch (err) {
      console.error('Error al cargar disponibilidad:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sincronizar perfil logueado
  useEffect(() => {
    if (currentProfile && currentProfile !== 'guest') {
      setSelectedMemberId(currentProfile);
      setActiveTab('my-calendar');
    } else if (currentProfile === 'guest') {
      setActiveTab('team-summary');
    }
  }, [currentProfile]);

  // Actualizar draft al cambiar el miembro o los datos
  useEffect(() => {
    const existing = availabilityData[selectedMemberId] || {};
    setDraftWeeks({ ...existing });
  }, [selectedMemberId, availabilityData]);

  // Meses a mostrar horizontalmente según el modo y navegación
  const displayedMonths = useMemo(() => {
    if (monthViewMode === 'all') {
      return SEMESTER_CALENDAR_MONTHS; // Ago, Sep, Oct, Nov, Dic
    }
    const count = monthViewMode === '3-months' ? 3 : 4;
    const start = Math.max(0, Math.min(startMonthIndex, SEMESTER_CALENDAR_MONTHS.length - count));
    return SEMESTER_CALENDAR_MONTHS.slice(start, start + count);
  }, [monthViewMode, startMonthIndex]);

  // Estructura precalculada de cada mes con sus semanas y días
  const monthDataList = useMemo(() => {
    return displayedMonths.map(m => ({
      ...m,
      weeks: generateMonthWeeks(m.year, m.monthIndex)
    }));
  }, [displayedMonths]);

  // Semanas para el resumen del equipo
  const summaryWeeks = useMemo(() => {
    if (summaryUpcomingOnly) {
      return SEMESTER_WEEKS_2026_2.filter(w => w.weekNumber >= currentWeekNum);
    }
    return SEMESTER_WEEKS_2026_2;
  }, [summaryUpcomingOnly, currentWeekNum]);

  // Acción de pintar una semana haciendo clic en ella
  const handlePaintWeek = (weekNum) => {
    if (isGuest) return; // En modo visita no se puede pintar

    setDraftWeeks(prev => {
      const currentLevel = prev[weekNum]?.level;

      // Si el pincel activo es 'clear', borramos la selección
      if (activeBrush === 'clear') {
        const next = { ...prev };
        delete next[weekNum];
        return next;
      }

      // Si ya tiene el mismo color del pincel, se desmarca a sin color
      if (currentLevel === activeBrush) {
        const next = { ...prev };
        delete next[weekNum];
        return next;
      }

      // De lo contrario, se pinta con el pincel activo
      return {
        ...prev,
        [weekNum]: {
          ...(prev[weekNum] || {}),
          level: activeBrush
        }
      };
    });
    setSaveSuccess(false);
  };

  // Alternar ciclando el color al hacer clic directo en el botón de la semana
  const handleCycleWeekColor = (weekNum, e) => {
    e.stopPropagation();
    if (isGuest) return; // En modo visita no se puede pintar

    setDraftWeeks(prev => {
      const currentLevel = prev[weekNum]?.level;
      // Ciclo: Sin color -> Muy Alta -> Alta -> Media -> Baja -> Mínima -> Sin color
      let nextLevel = null;
      if (!currentLevel) nextLevel = 'very_high';
      else if (currentLevel === 'very_high') nextLevel = 'high';
      else if (currentLevel === 'high') nextLevel = 'medium';
      else if (currentLevel === 'medium') nextLevel = 'low';
      else if (currentLevel === 'low') nextLevel = 'minimal';
      else nextLevel = null;

      if (!nextLevel) {
        const next = { ...prev };
        delete next[weekNum];
        return next;
      }

      return {
        ...prev,
        [weekNum]: {
          ...(prev[weekNum] || {}),
          level: nextLevel
        }
      };
    });
    setSaveSuccess(false);
  };

  // Guardar disponibilidad en la base de datos
  const handleSaveAvailability = async () => {
    try {
      setSaving(true);
      await dbService.saveMemberFullSemesterAvailability(selectedMemberId, draftWeeks, '2026-2');
      
      setAvailabilityData(prev => ({
        ...prev,
        [selectedMemberId]: { ...draftWeeks }
      }));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert('Error al guardar disponibilidad: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Ciclo rápido de 5 niveles en la matriz del equipo
  const handleQuickCycleInTable = async (memberId, weekNum) => {
    const canEdit = isAdmin || currentProfile === memberId;
    if (!canEdit) return;

    const currentLevel = availabilityData[memberId]?.[weekNum]?.level;
    let nextLevel = null;
    if (!currentLevel) nextLevel = 'very_high';
    else if (currentLevel === 'very_high') nextLevel = 'high';
    else if (currentLevel === 'high') nextLevel = 'medium';
    else if (currentLevel === 'medium') nextLevel = 'low';
    else if (currentLevel === 'low') nextLevel = 'minimal';
    else nextLevel = null;

    setAvailabilityData(prev => {
      const memberObj = { ...(prev[memberId] || {}) };
      if (!nextLevel) {
        delete memberObj[weekNum];
      } else {
        memberObj[weekNum] = { level: nextLevel };
      }
      return {
        ...prev,
        [memberId]: memberObj
      };
    });

    try {
      await dbService.saveMemberAvailability(memberId, weekNum, { level: nextLevel }, '2026-2');
    } catch (e) {
      console.error('Error al actualizar:', e);
    }
  };

  // Navegación de meses horizontal
  const canGoPrev = startMonthIndex > 0;
  const canGoNext = startMonthIndex + (monthViewMode === '3-months' ? 3 : 4) < SEMESTER_CALENDAR_MONTHS.length;

  const handlePrevMonth = () => {
    if (canGoPrev) setStartMonthIndex(prev => prev - 1);
  };

  const handleNextMonth = () => {
    if (canGoNext) setStartMonthIndex(prev => prev + 1);
  };

  const selectedMemberObj = getTeamMember(selectedMemberId) || TEAM_MEMBERS[0];

  const membersWithResponses = useMemo(() => {
    let count = 0;
    TEAM_MEMBERS.forEach(m => {
      const data = availabilityData[m.id];
      if (data && Object.keys(data).length > 0) {
        const hasDefined = Object.values(data).some(v => v && v.level);
        if (hasDefined) count++;
      }
    });
    return count;
  }, [availabilityData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      

      {/* 2. PESTAÑAS PRINCIPALES: MI CALENDARIO VS RESUMEN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          backgroundColor: 'var(--bg-secondary, #121826)',
          padding: '0.3rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color, #243049)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('my-calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.15rem',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'my-calendar' ? 'var(--accent-primary, #0ea5e9)' : 'transparent',
              color: activeTab === 'my-calendar' ? 'white' : 'var(--text-secondary, #94a3b8)',
              transition: 'all 0.15s'
            }}
          >
            <Calendar size={15} />
            <span>{isGuest ? 'Ver Calendario por Integrante' : 'Mi Calendario de Disponibilidad'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team-summary')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.15rem',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'team-summary' ? 'var(--accent-primary, #0ea5e9)' : 'transparent',
              color: activeTab === 'team-summary' ? 'white' : 'var(--text-secondary, #94a3b8)',
              transition: 'all 0.15s'
            }}
          >
            <Users size={15} />
            <span>Resumen del Equipo</span>
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              marginLeft: '0.2rem'
            }}>
              {membersWithResponses}/{TEAM_MEMBERS.length}
            </span>
          </button>
        </div>

        {/* Si estamos en Mi Calendario: Selector de 3 Meses / 4 Meses / Todo */}
        {activeTab === 'my-calendar' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Mostrar:</span>
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              backgroundColor: 'var(--bg-secondary, #121826)',
              padding: '0.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                type="button"
                onClick={() => setMonthViewMode('3-months')}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: monthViewMode === '3-months' ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: monthViewMode === '3-months' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                  color: monthViewMode === '3-months' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                3 Meses
              </button>
              <button
                type="button"
                onClick={() => setMonthViewMode('4-months')}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: monthViewMode === '4-months' ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: monthViewMode === '4-months' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                  color: monthViewMode === '4-months' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                4 Meses
              </button>
              <button
                type="button"
                onClick={() => setMonthViewMode('all')}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: monthViewMode === 'all' ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: monthViewMode === 'all' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                  color: monthViewMode === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                Todo el Semestre
              </button>
            </div>

            {monthViewMode !== 'all' && (
              <div style={{ display: 'flex', gap: '0.2rem', marginLeft: '0.2rem' }}>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: canGoPrev ? 1 : 0.4 }}
                  title="Meses anteriores"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={!canGoNext}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: canGoNext ? 1 : 0.4 }}
                  title="Meses siguientes"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
         VISTA 1: MI CALENDARIO DE DISPONIBILIDAD
         Horizontal, clásico, con semanas a la izquierda y pintura directa
         ==================================================================== */}
      {activeTab === 'my-calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* BARRA DE HERRAMIENTAS: PERFIL + PALETA O MODO LECTURA */}
          <div className="card" style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.7)'
          }}>
            {isGuest ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{selectedMemberObj.avatar}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Viendo calendario de:</span>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.15rem 0.5rem', fontSize: '0.84rem', fontWeight: 700, color: selectedMemberObj.color }}
                    >
                      {TEAM_MEMBERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <span>🔒</span>
                  <span>Modo Visita (Solo Lectura) — Inicia sesión como integrante para pintar tu calendario</span>
                </div>
              </div>
            ) : (
              <>
                {/* Integrante autenticado */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{selectedMemberObj.avatar}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pintando para:</span>
                      {isAdmin ? (
                        <select
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          className="form-input"
                          style={{ padding: '0.15rem 0.5rem', fontSize: '0.84rem', fontWeight: 700, color: selectedMemberObj.color }}
                        >
                          {TEAM_MEMBERS.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.role.split('/')[0].trim()})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: selectedMemberObj.color }}>
                          {selectedMemberObj.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Paleta de Color / Pincel */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
                    <Paintbrush size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span>Pincel activo:</span>
                  </div>

                  {AVAILABILITY_LEVELS_ARRAY.map(lvl => {
                    const isActive = activeBrush === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setActiveBrush(lvl.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '7px',
                          border: isActive ? `1.5px solid ${lvl.color}` : '1.5px solid var(--border-color, #243049)',
                          backgroundColor: isActive ? lvl.color : 'rgba(15, 23, 42, 0.8)',
                          color: isActive ? '#000000' : 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          boxShadow: isActive ? `0 0 10px ${lvl.color}50` : 'none',
                          transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                          boxSizing: 'border-box',
                          whiteSpace: 'nowrap'
                        }}
                        title={`${lvl.label} (${lvl.hours}): ${lvl.description}`}
                      >
                        <span>{lvl.icon}</span>
                        <span>{lvl.label}</span>
                        <span style={{ fontSize: '0.68rem', opacity: isActive ? 0.9 : 0.6 }}>({lvl.hours})</span>
                      </button>
                    );
                  })}

                  {/* Botón Borrador */}
                  <button
                    type="button"
                    onClick={() => setActiveBrush('clear')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '7px',
                      border: activeBrush === 'clear' ? '1.5px solid #ef4444' : '1.5px solid var(--border-color, #243049)',
                      backgroundColor: activeBrush === 'clear' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                      color: activeBrush === 'clear' ? '#ef4444' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease'
                    }}
                    title="Borrador: haz clic en una semana para quitarle el color"
                  >
                    <X size={13} />
                    <span>Borrar</span>
                  </button>
                </div>

                {/* Botón de Guardar */}
                <button
                  type="button"
                  onClick={handleSaveAvailability}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.25rem',
                    fontWeight: 600,
                    fontSize: '0.84rem'
                  }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Guardando...' : 'Guardar Disponibilidad'}</span>
                </button>
              </>
            )}

          </div>

          {/* Feedback de guardado */}
          {saveSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 500
            }}>
              <CheckCircle2 size={17} />
              <span>¡Disponibilidad guardada correctamente! Ya se refleja en el resumen del equipo.</span>
            </div>
          )}

          {/* ====================================================================
             CONTENEDOR HORIZONTAL DE MESES CLÁSICOS (TIPO WINDOWS CALENDAR)
             ==================================================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${displayedMonths.length}, minmax(290px, 1fr))`,
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            {monthDataList.map(month => (
              <div
                key={month.id}
                className="card"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#161d2d',
                  border: '1px solid var(--border-color, #243049)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  minWidth: '290px'
                }}
              >
                {/* Título del Mes (ej. septiembre 2026) */}
                <div style={{ 
                  textAlign: 'center', 
                  fontWeight: 700, 
                  fontSize: '0.98rem', 
                  color: 'var(--text-primary)',
                  letterSpacing: '0.3px',
                  padding: '0.2rem 0'
                }}>
                  {month.name}
                </div>

                {/* Grilla del Calendario */}
                <div style={{ width: '100%' }}>
                  
                  {/* Encabezado de Días: SEM | LU | MA | MI | JU | VI | SÁ | DO */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px repeat(7, 1fr)',
                    textAlign: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted, #94a3b8)',
                    marginBottom: '0.4rem',
                    paddingBottom: '0.3rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
                  }}>
                    <span>SEM</span>
                    <span>LU</span>
                    <span>MA</span>
                    <span>MI</span>
                    <span>JU</span>
                    <span>VI</span>
                    <span>SÁ</span>
                    <span>DO</span>
                  </div>

                  {/* Filas de Semanas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {month.weeks.map(week => {
                      const currentVal = draftWeeks[week.weekNumber];
                      const levelId = currentVal?.level;
                      const levelObj = levelId ? AVAILABILITY_LEVELS[levelId] : null;
                      const isCurrentWeek = week.weekNumber === currentWeekNum;

                      return (
                        <div
                          key={week.weekNumber}
                          onClick={() => handlePaintWeek(week.weekNumber)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '50px repeat(7, 1fr)',
                            alignItems: 'center',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: '2px 0',
                            backgroundColor: levelObj 
                              ? levelObj.bgColor 
                              : isCurrentWeek 
                                ? 'rgba(14, 165, 233, 0.08)' 
                                : 'transparent',
                            border: levelObj 
                              ? `1px solid ${levelObj.borderColor}` 
                              : isCurrentWeek 
                                ? '1px dashed rgba(14, 165, 233, 0.35)' 
                                : '1px solid transparent',
                            transition: 'all 0.12s ease'
                          }}
                          title={`Semana ${week.weekNumber}: ${levelObj ? levelObj.label + ' (' + levelObj.hours + ')' : 'Sin definir'}\nHaz clic para pintar con el pincel activo`}
                        >
                          
                          {/* Botón de la Semana (Columna Izquierda) */}
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '0 2px' }}>
                            <button
                              type="button"
                              onClick={(e) => handleCycleWeekColor(week.weekNumber, e)}
                              style={{
                                width: '100%',
                                padding: '0.2rem 0',
                                borderRadius: '4px',
                                border: levelObj ? `1px solid ${levelObj.borderColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: levelObj ? levelObj.color : 'rgba(0, 0, 0, 0.3)',
                                color: levelObj ? '#000000' : 'var(--text-muted)',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.12s ease'
                              }}
                              title={`Semana ${week.weekNumber}\nHaz clic para alternar color`}
                            >
                              Sem {week.weekNumber}
                            </button>
                          </div>

                          {/* 7 Días de la Semana */}
                          {week.days.map((day, dIdx) => {
                            const isToday = day.isToday;
                            const isCurrentMonth = day.isCurrentMonth;
                            const ev = day.event;

                            return (
                              <div
                                key={dIdx}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '32px',
                                  position: 'relative'
                                }}
                                title={ev ? `${day.dayNumber}: ${ev.title}` : undefined}
                              >
                                <div style={{
                                  width: isToday ? '24px' : 'auto',
                                  height: isToday ? '24px' : 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: isToday ? '4px' : '0',
                                  backgroundColor: isToday ? '#0ea5e9' : 'transparent',
                                  color: isToday 
                                    ? '#ffffff' 
                                    : isCurrentMonth 
                                      ? 'var(--text-primary, #f1f5f9)' 
                                      : '#475569',
                                  fontWeight: isToday ? 800 : isCurrentMonth ? 600 : 400,
                                  fontSize: '0.8rem'
                                }}>
                                  {day.dayNumber}
                                </div>

                                {/* Marcador de evento oficial USM en la celda */}
                                {ev && (
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '1px',
                                    fontSize: '0.58rem',
                                    lineHeight: 1
                                  }}>
                                    {ev.icon}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* LEYENDA DISCRETA DE EVENTOS OFICIALES USM AL PIE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid var(--border-color, #243049)',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Hitos del calendario:</span>
            <span>🇨🇱 <strong>14-18 Sep</strong>: Receso Fiestas Patrias</span>
            <span>🛡️ <strong>21-22 Sep</strong>: Colchón Académico</span>
            <span>🏛️ <strong>14-17 Oct</strong>: Puertas Abiertas USM</span>
            <span>📅 <strong>31 Oct - 01 Nov</strong>: Feriados</span>
            <span>🏁 <strong>04 Dic</strong>: Fin de Clases</span>
            <span>📝 <strong>09-11 Dic</strong>: Exámenes Finales</span>
          </div>

        </div>
      )}

      {/* ====================================================================
         VISTA 2: RESUMEN DEL EQUIPO (MATRIZ CONSERVADA SEGÚN FEEDBACK)
         ==================================================================== */}
      {activeTab === 'team-summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Barra de estado y filtro */}
          <div className="card" style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
              <Users size={18} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <span style={{ fontWeight: 600 }}>Estado del Registro: </span>
                <span style={{ color: membersWithResponses === TEAM_MEMBERS.length ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {membersWithResponses} de {TEAM_MEMBERS.length} integrantes
                </span>
                <span style={{ color: 'var(--text-secondary)' }}> han completado su disponibilidad.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setSummaryUpcomingOnly(!summaryUpcomingOnly)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Filter size={13} />
                <span>{summaryUpcomingOnly ? 'Ver semanas restantes (Sem. 6 a 20)' : 'Ver semestre completo (Sem. 1 a 20)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-calendar')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Pintar mi calendario</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* TABLA MATRIZ LIMPIA Y DESPEJADA */}
          <div className="card" style={{ padding: '0.5rem', overflowX: 'auto', borderRadius: '12px' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '950px', fontSize: '0.78rem', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {/* Columna Integrante fija */}
                  <th style={{ 
                    position: 'sticky', 
                    left: 0, 
                    zIndex: 10, 
                    backgroundColor: 'var(--bg-secondary, #121826)',
                    minWidth: '180px',
                    padding: '0.75rem 0.9rem',
                    textAlign: 'left',
                    borderBottom: '2px solid var(--border-color, #243049)'
                  }}>
                    Integrante ({TEAM_MEMBERS.length})
                  </th>

                  {/* Columnas de Semanas */}
                  {summaryWeeks.map(w => {
                    return (
                      <th
                        key={w.weekNumber}
                        style={{
                          textAlign: 'center',
                          padding: '0.6rem 0.4rem',
                          minWidth: '85px',
                          borderBottom: w.isCurrent ? '2px solid var(--accent-primary)' : '2px solid var(--border-color, #243049)',
                          backgroundColor: w.isCurrent 
                            ? 'rgba(14, 165, 233, 0.12)' 
                            : w.isVacation
                              ? 'rgba(245, 158, 11, 0.08)'
                              : 'transparent'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: w.isCurrent ? 'var(--accent-primary)' : 'inherit' }}>
                          Sem {w.weekNumber}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {w.dateRange.split('-')[0].trim()}
                        </div>

                        {w.isVacation && (
                          <div 
                            style={{ 
                              marginTop: '0.2rem', 
                              fontSize: '0.62rem', 
                              color: '#f59e0b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.15rem',
                              padding: '0.05rem 0.3rem',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)'
                            }}
                            title="Vacaciones Fiestas Patrias USM - Sin Clases"
                          >
                            <span>🇨🇱 Vacaciones</span>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {TEAM_MEMBERS.map(member => {
                  const isCurrentLogged = currentProfile === member.id;
                  const memberData = availabilityData[member.id] || {};
                  const canEdit = isAdmin || isCurrentLogged;

                  return (
                    <tr 
                      key={member.id}
                      style={{
                        backgroundColor: isCurrentLogged ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                        borderBottom: '1px solid var(--border-color, #243049)'
                      }}
                    >
                      {/* Integrante (Columna Fija) */}
                      <td style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 9,
                        backgroundColor: 'var(--bg-secondary, #121826)',
                        padding: '0.55rem 0.9rem',
                        borderRight: '1px solid var(--border-color, #243049)',
                        borderBottom: '1px solid var(--border-color, #243049)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{member.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: member.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span>{member.name}</span>
                              {isCurrentLogged && (
                                <span style={{
                                  fontSize: '0.6rem',
                                  padding: '0.05rem 0.3rem',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                                  color: 'var(--accent-primary)'
                                }}>
                                  Tú
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              {member.role.split('/')[0].trim()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Celdas de Semanas */}
                      {summaryWeeks.map(w => {
                        const entry = memberData[w.weekNumber];
                        const lvlKey = entry?.level;
                        const lvlObj = lvlKey ? AVAILABILITY_LEVELS[lvlKey] : null;

                        return (
                          <td
                            key={w.weekNumber}
                            style={{
                              textAlign: 'center',
                              padding: '0.4rem 0.25rem',
                              borderBottom: '1px solid var(--border-color, #243049)',
                              backgroundColor: w.isVacation ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
                            }}
                          >
                            <div
                              onClick={() => canEdit && handleQuickCycleInTable(member.id, w.weekNumber)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '60px',
                                padding: '0.22rem 0.45rem',
                                borderRadius: '6px',
                                backgroundColor: lvlObj ? lvlObj.bgColor : 'transparent',
                                border: lvlObj ? `1px solid ${lvlObj.borderColor}` : '1px dashed rgba(255, 255, 255, 0.1)',
                                cursor: canEdit ? 'pointer' : 'default',
                                transition: 'all 0.12s ease',
                                userSelect: 'none'
                              }}
                              title={
                                lvlObj
                                  ? `${member.name} - Sem ${w.weekNumber}: ${lvlObj.label} (${lvlObj.hours})${canEdit ? '\n(Clic para alternar color)' : ''}`
                                  : `${member.name} - Sem ${w.weekNumber}: Sin definir${canEdit ? '\n(Clic para asignar color)' : ''}`
                              }
                            >
                              {lvlObj ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.74rem', fontWeight: 600, color: lvlObj.color }}>
                                  <span>{lvlObj.icon}</span>
                                  <span>{lvlObj.shortLabel}</span>
                                </div>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>—</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* FILA DE RESUMEN: CONTEO POR SEMANA */}
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)' }}>
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 9,
                    backgroundColor: 'var(--bg-secondary, #121826)',
                    padding: '0.6rem 0.9rem',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    borderTop: '2px solid var(--border-color, #243049)'
                  }}>
                    Disponibles por semana
                  </td>

                  {summaryWeeks.map(w => {
                    let veryHigh = 0;
                    let high = 0;
                    let med = 0;
                    let low = 0;
                    let minimal = 0;

                    TEAM_MEMBERS.forEach(m => {
                      const lvl = availabilityData[m.id]?.[w.weekNumber]?.level;
                      if (lvl === 'very_high') veryHigh++;
                      else if (lvl === 'high') high++;
                      else if (lvl === 'medium') med++;
                      else if (lvl === 'low') low++;
                      else if (lvl === 'minimal') minimal++;
                    });

                    const totalReported = veryHigh + high + med + low + minimal;

                    return (
                      <td 
                        key={w.weekNumber} 
                        style={{ 
                          textAlign: 'center', 
                          padding: '0.5rem 0.2rem', 
                          borderTop: '2px solid var(--border-color, #243049)',
                          fontSize: '0.66rem'
                        }}
                      >
                        {totalReported > 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', fontWeight: 600, flexWrap: 'wrap' }}>
                            {veryHigh > 0 && <span style={{ color: '#10b981' }} title="Muy Alta">🟢{veryHigh}</span>}
                            {high > 0 && <span style={{ color: '#22c55e' }} title="Alta">🟢{high}</span>}
                            {med > 0 && <span style={{ color: '#eab308' }} title="Media">🟡{med}</span>}
                            {low > 0 && <span style={{ color: '#f97316' }} title="Baja">🟠{low}</span>}
                            {minimal > 0 && <span style={{ color: '#ef4444' }} title="Mínima">🔴{minimal}</span>}
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
