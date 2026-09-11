// ====================================================================
// UAVUSM - Directorio Oficial de Miembros del Equipo
// ====================================================================

export const TEAM_MEMBERS = [
  {
    id: 'mateo',
    name: 'Mateo',
    fullName: 'Mateo',
    alias: 'Mateo',
    role: 'Líder General / Software & AR',
    email: 'mateo@usm.cl',
    avatar: '👨‍💻',
    initials: 'MA',
    color: '#0ea5e9', // Sky blue
    bgBadge: 'rgba(14, 165, 233, 0.15)',
    borderBadge: 'rgba(14, 165, 233, 0.35)',
    isMateo: true
  },
  {
    id: 'pablo',
    name: 'Pablo',
    fullName: 'Pablo',
    alias: 'Pablo',
    role: 'Estructura, Acabados & Pintura',
    email: 'pablo@usm.cl',
    avatar: '🎨',
    initials: 'PA',
    color: '#f97316', // Orange
    bgBadge: 'rgba(249, 115, 22, 0.15)',
    borderBadge: 'rgba(249, 115, 22, 0.35)',
    isMateo: false
  },
  {
    id: 'paula',
    name: 'Paula',
    fullName: 'Paula',
    alias: 'Paula',
    role: 'Diseño Gráfico, Branding & Stickers',
    email: 'paula@usm.cl',
    avatar: '✨',
    initials: 'PU',
    color: '#ec4899', // Pink
    bgBadge: 'rgba(236, 72, 153, 0.15)',
    borderBadge: 'rgba(236, 72, 153, 0.35)',
    isMateo: false
  },
  {
    id: 'roro',
    name: 'Roro',
    fullName: 'Rodrigo (Roro)',
    alias: 'Roro',
    role: 'Montaje Aeronáutico & Líder Skybetol',
    email: 'roro@usm.cl',
    avatar: '🛩️',
    initials: 'RO',
    color: '#10b981', // Emerald
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    borderBadge: 'rgba(16, 185, 129, 0.35)',
    isMateo: false
  },
  {
    id: 'renato',
    name: 'Renato',
    fullName: 'Renato',
    alias: 'Renato',
    role: 'Diseño CAD 3D & Líder Skycopter',
    email: 'renato@usm.cl',
    avatar: '🚁',
    initials: 'RE',
    color: '#a855f7', // Purple
    bgBadge: 'rgba(168, 85, 247, 0.15)',
    borderBadge: 'rgba(168, 85, 247, 0.35)',
    isMateo: false
  },
  {
    id: 'bicho',
    name: 'Bicho',
    fullName: 'Vicente (Bicho)',
    alias: 'Bicho',
    role: 'Grabación Audiovisual & Ensayos en Terreno',
    email: 'bicho@usm.cl',
    avatar: '📹',
    initials: 'BI',
    color: '#eab308', // Yellow
    bgBadge: 'rgba(234, 179, 8, 0.15)',
    borderBadge: 'rgba(234, 179, 8, 0.35)',
    isMateo: false
  },
  {
    id: 'tomas',
    name: 'Tomás',
    fullName: 'Tomás',
    alias: 'Tomás',
    role: 'Mecánica, Cierre Hermético & Líder Skydoc',
    email: 'tomas@usm.cl',
    avatar: '⚙️',
    initials: 'TO',
    color: '#06b6d4', // Cyan
    bgBadge: 'rgba(6, 182, 212, 0.15)',
    borderBadge: 'rgba(6, 182, 212, 0.35)',
    isMateo: false
  },
  {
    id: 'liss',
    name: 'Liss',
    fullName: 'Liss',
    alias: 'Liss',
    role: 'Infraestructura & Pista FPV',
    email: 'liss@usm.cl',
    avatar: '🏁',
    initials: 'LI',
    color: '#8b5cf6', // Violet
    bgBadge: 'rgba(139, 92, 246, 0.15)',
    borderBadge: 'rgba(139, 92, 246, 0.35)',
    isMateo: false
  },
  {
    id: 'nicolas',
    name: 'Nicolás Pazols',
    fullName: 'Nicolás Pazols',
    alias: 'Nicolás',
    role: 'CEO Skydrone / Empresa Colaboradora',
    email: 'nicolas.pazols@skydrone.cl',
    avatar: '🦅',
    initials: 'NP',
    color: '#0284c7', // Sky Blue Skydrone
    bgBadge: 'rgba(2, 132, 199, 0.15)',
    borderBadge: 'rgba(2, 132, 199, 0.35)',
    isMateo: false,
    isPartner: true,
    company: 'Skydrone'
  }
];

/**
 * Busca un miembro del equipo por ID, nombre o alias (insensible a mayúsculas/tildes).
 */
export function getTeamMember(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return TEAM_MEMBERS.find(m => {
    const mId = m.id.toLowerCase();
    const mName = m.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const mAlias = m.alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return mId === clean || mName === clean || mAlias === clean || 
      (m.id === 'liss' && (clean === 'liz' || clean === 'la liz')) ||
      (m.id === 'nicolas' && (clean === 'nico' || clean === 'pazols' || clean === 'skydrone' || clean === 'nicolas pazols'));
  }) || null;
}

/**
 * Parsea un string que contiene uno o varios responsables (ej. "Pablo y Mateo", "Mateo, Renato y Bicho")
 * y devuelve los miembros correspondientes.
 */
export function parseAssignedMembers(assignedStr) {
  if (!assignedStr) return [];
  const normalized = assignedStr
    .replace(/\s+y\s+/gi, ', ')
    .replace(/\s+e\s+/gi, ', ')
    .replace(/\s*&\s*/g, ', ');
  
  const tokens = normalized.split(',').map(t => t.trim()).filter(Boolean);
  const found = [];

  for (const token of tokens) {
    const member = getTeamMember(token);
    if (member) {
      found.push(member);
    } else {
      // Placeholder para responsables no identificados
      found.push({
        id: token.toLowerCase().replace(/\s+/g, '_'),
        name: token,
        alias: token,
        role: 'Colaborador',
        avatar: '👤',
        initials: token.substring(0, 2).toUpperCase(),
        color: '#64748b',
        bgBadge: 'rgba(100, 116, 139, 0.15)',
        borderBadge: 'rgba(100, 116, 139, 0.35)'
      });
    }
  }

  return found;
}
