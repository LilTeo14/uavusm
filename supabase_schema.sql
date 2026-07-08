-- ====================================================================
-- UAVUSM Dashboard - Esquema de Base de Datos para Supabase
-- ====================================================================

-- 1. Habilitar la extensión para UUIDs (normalmente habilitada por defecto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Limpieza de tablas previas (en caso de que existan)
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;

-- 3. Crear tabla de Proyectos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    leader_name TEXT,
    leader_email TEXT,
    status TEXT NOT NULL CHECK (status IN ('Por iniciar', 'En progreso', 'Completado')) DEFAULT 'Por iniciar',
    due_date DATE,
    image_url TEXT,
    doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla de Materiales
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'purchased')) DEFAULT 'pending',
    requested_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Crear tabla de Tareas
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    due_date DATE,
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Insertar los 5 proyectos semilla reales con la info de la pizarra e imágenes
INSERT INTO projects (id, name, description, budget, leader_name, leader_email, status, due_date, image_url)
VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'SkyCopter Dock v1',
    'Fabricación del primer prototipo del SkyDock, este prototipo constará del dock con las tapas.',
    100000.00,
    'Tomás',
    'tomas@usm.cl',
    'Por iniciar',
    '2026-07-31',
    '/skydock.png'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'Recubrimiento SkyVtol',
    'Proceso de remoción de recubrimiento antiguo, testeo de nuevos recubrimientos y aplicación.',
    100000.00,
    'Bobo',
    'bobo@usm.cl',
    'Por iniciar',
    '2026-07-31',
    NULL
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    'SkyCopter design v1',
    'Fabricación de la carcasa del SkyCopter en impresión 3d, posteriormente se deben colocar insertos metálicos y componentes.',
    330000.00,
    'Renato',
    'renato@usm.cl',
    'Por iniciar',
    '2026-07-31',
    '/skycopter.png'
  ),
  (
    'd4444444-4444-4444-4444-444444444444',
    'SkyCopter AR Module',
    'Implementación de visión por computador y realidad aumentada (AR) para el aterrizaje del dron.',
    150000.00,
    'Mateo',
    'mateo@usm.cl',
    'Por iniciar',
    '2026-07-31',
    '/skycopter.png'
  ),
  (
    'd5555555-5555-5555-5555-555555555555',
    'Pista de carreras',
    'Fabricación de una primera versión de una pista de carreras en tubos de pvc.',
    200000.00,
    'Liss',
    'liss@usm.cl',
    'Por iniciar',
    '2026-07-17',
    NULL
  );

-- 7. Insertar tareas semilla reales
INSERT INTO tasks (id, project_id, title, description, assigned_to, due_date, status)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'Diseñar Carcasa',
    'Modelado y simulación de la carcasa del SkyDock.',
    'Tomás',
    '2026-07-15',
    'todo'
  ),
  (
    'a2222222-2222-2222-2222-222222222221',
    'd2222222-2222-2222-2222-222222222222',
    'Testeo Recubrimientos',
    'Testeo de nuevos recubrimientos y su aplicación.',
    'Bobo',
    '2026-07-15',
    'todo'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Fast Release Batería',
    'Diseño y ensamblaje del mecanismo de liberación rápida.',
    'Paolo',
    '2026-07-20',
    'todo'
  ),
  (
    'a3333333-3333-3333-3333-333333333331',
    'd3333333-3333-3333-3333-333333333333',
    'Diseñar Carcasa',
    'Fabricación de la carcasa del SkyCopter en impresión 3d.',
    'Renato',
    '2026-07-15',
    'todo'
  ),
  (
    'a4444444-4444-4444-4444-444444444441',
    'd4444444-4444-4444-4444-444444444444',
    'Configuración del módulo AR',
    'Calibrar la cámara y programar la detección de marcadores ArUco.',
    'Mateo',
    '2026-07-20',
    'todo'
  ),
  (
    'a5555555-5555-5555-5555-555555555551',
    'd5555555-5555-5555-5555-555555555555',
    'Diseño y Construcción',
    'Modelado y armado de la pista en tubos de pvc.',
    'Liss',
    '2026-07-10',
    'todo'
  );

-- 8. Insertar materiales semilla reales
INSERT INTO materials (id, project_id, name, quantity, unit_price, status, requested_by)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'Filamentos y fijaciones',
    1,
    60000.00,
    'approved',
    'Tomás'
  ),
  (
    'b1111111-1111-1111-1111-111111111112',
    'd1111111-1111-1111-1111-111111111111',
    'Componentes de acople de carga',
    1,
    40000.00,
    'pending',
    'Tomás'
  ),
  -- VTOL materiales (total $100.000)
  (
    'b2222222-2222-2222-2222-222222222221',
    'd2222222-2222-2222-2222-222222222222',
    'Lijas',
    1,
    30000.00,
    'approved',
    'Bobo'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Pigmento',
    1,
    5000.00,
    'approved',
    'Bobo'
  ),
  (
    'b2222222-2222-2222-2222-222222222223',
    'd2222222-2222-2222-2222-222222222222',
    'Filtros Vapores',
    1,
    25000.00,
    'pending',
    'Bobo'
  ),
  (
    'b2222222-2222-2222-2222-222222222224',
    'd2222222-2222-2222-2222-222222222222',
    'Gramera 0.01g',
    1,
    15000.00,
    'pending',
    'Bobo'
  ),
  (
    'b2222222-2222-2222-2222-222222222225',
    'd2222222-2222-2222-2222-222222222222',
    'Pinceles / Esponjas',
    1,
    10000.00,
    'pending',
    'Bobo'
  ),
  (
    'b2222222-2222-2222-2222-222222222226',
    'd2222222-2222-2222-2222-222222222222',
    'Visita Enaer',
    1,
    15000.00,
    'pending',
    'Bobo'
  ),
  -- SkyCopter Design ($330.000)
  (
    'b3333333-3333-3333-3333-333333333331',
    'd3333333-3333-3333-3333-333333333333',
    'Frame',
    1,
    180000.00,
    'approved',
    'Renato'
  ),
  (
    'b3333333-3333-3333-3333-333333333332',
    'd3333333-3333-3333-3333-333333333333',
    'FC ArduPilot',
    1,
    150000.00,
    'pending',
    'Renato'
  ),
  -- AR Module ($150.000)
  (
    'b4444444-4444-4444-4444-444444444441',
    'd4444444-4444-4444-4444-444444444444',
    'Cámara de alta velocidad',
    1,
    90000.00,
    'approved',
    'Mateo'
  ),
  (
    'b4444444-4444-4444-4444-444444444442',
    'd4444444-4444-4444-4444-444444444444',
    'Computador de placa reducida (SBC)',
    1,
    60000.00,
    'pending',
    'Mateo'
  ),
  -- Pista ($200.000)
  (
    'b5555555-5555-5555-5555-555555555551',
    'd5555555-5555-5555-5555-555555555555',
    'Tubos de PVC',
    1,
    120000.00,
    'approved',
    'Liss'
  ),
  (
    'b5555555-5555-5555-5555-555555555552',
    'd5555555-5555-5555-5555-555555555555',
    'Accesorios de unión y meta',
    1,
    80000.00,
    'pending',
    'Liss'
  );

-- ====================================================================
-- Configuración del Bucket de Almacenamiento (Supabase Storage)
-- ====================================================================

-- Crear el bucket de almacenamiento para imágenes y archivos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('uavusm-files', 'uavusm-files', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar acceso de lectura público al bucket 'uavusm-files'
CREATE POLICY "Acceso Público de Lectura" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uavusm-files');

-- Habilitar inserción a cualquier usuario (público)
CREATE POLICY "Permitir Carga de Archivos Pública" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uavusm-files');

-- Habilitar actualización a cualquier usuario
CREATE POLICY "Permitir Modificación Pública" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'uavusm-files');

-- Habilitar eliminación a cualquier usuario
CREATE POLICY "Permitir Borrado Público" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'uavusm-files');

-- ====================================================================
-- Estructura para Tabla de Notas de Proyecto (Agregado)
-- ====================================================================
CREATE TABLE IF NOT EXISTS project_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar la nota semilla real desde analisis_recubrimientos_ligeros.md para el proyecto Recubrimiento SkyVtol
INSERT INTO project_notes (id, project_id, title, content)
VALUES (
    'e2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Métodos de Recubrimiento Ultra-Ligero para UAVs de Espuma',
    $content$# Métodos de Recubrimiento Ultra-Ligero para UAVs de Espuma

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
| **Adaptabilidad a Curvas** | Excelente | Excelente | Excelente | Complejo | Complejo |$content$
) ON CONFLICT (id) DO NOTHING;
