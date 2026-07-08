import { createClient } from '@supabase/supabase-js';

// 1. Detección y Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const adminPin = import.meta.env.VITE_ADMIN_PIN || '1234';

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://tu-proyecto.supabase.co');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

console.log(
  isSupabaseConfigured 
    ? '📡 Conectado a Supabase en la nube.' 
    : '💾 Corriendo en modo LocalStorage (sin conexión a base de datos externa).'
);

// 2. Datos Semilla para Inicializar LocalStorage
const SEED_PROJECTS = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'SkyCopter Dock v1',
    description: 'Fabricación del primer prototipo del SkyDock, este prototipo constará del dock con las tapas.',
    budget: 100000.00,
    leader_name: 'Tomás',
    leader_email: 'tomas@usm.cl',
    status: 'Por iniciar',
    due_date: '2026-07-31',
    image_url: '/skydock.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Recubrimiento SkyVtol',
    description: 'Proceso de remoción de recubrimiento antiguo, testeo de nuevos recubrimientos y aplicación.',
    budget: 100000.00,
    leader_name: 'Bobo',
    leader_email: 'bobo@usm.cl',
    status: 'Por iniciar',
    due_date: '2026-07-31',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'SkyCopter design v1',
    description: 'Fabricación de la carcasa del SkyCopter en impresión 3d, posteriormente se deben colocar insertos metálicos y componentes.',
    budget: 330000.00,
    leader_name: 'Renato',
    leader_email: 'renato@usm.cl',
    status: 'Por iniciar',
    due_date: '2026-07-31',
    image_url: '/skycopter.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'SkyCopter AR Module',
    description: 'Implementación de visión por computador y realidad aumentada (AR) para el aterrizaje del dron.',
    budget: 150000.00,
    leader_name: 'Mateo',
    leader_email: 'mateo@usm.cl',
    status: 'Por iniciar',
    due_date: '2026-07-31',
    image_url: '/skycopter.png',
    doc_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Pista de carreras',
    description: 'Fabricación de una primera versión de una pista de carreras en tubos de pvc.',
    budget: 200000.00,
    leader_name: 'Liss',
    leader_email: 'liss@usm.cl',
    status: 'Por iniciar',
    due_date: '2026-07-17',
    image_url: null,
    doc_url: null,
    created_at: new Date().toISOString()
  }
];

const SEED_TASKS = [
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
    created_at: new Date().toISOString()
  }
];

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
};

if (!isSupabaseConfigured) {
  initializeLocalStorage();
}

// 3. API del Servicio de Datos (Encapsula la lógica de Supabase vs LocalStorage)
export const dbService = {
  // Comprobar si el PIN ingresado es de Administrador
  verifyAdminPin(pin) {
    return pin === adminPin;
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
  }
};
