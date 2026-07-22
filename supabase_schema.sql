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
    purchase_status TEXT,
    link TEXT,
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
    file_url TEXT,
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

-- Insertar las dos notas del proyecto Pista de carreras (Presupuesto y Propuesta Técnica)
INSERT INTO project_notes (id, project_id, title, content, file_url)
VALUES (
    'e5555555-5555-5555-5555-555555555551',
    'd5555555-5555-5555-5555-555555555555',
    'Presupuesto de Materiales Detallado: Pista de Drones FPV Recreativa (Capped $200k)',
    $content$# Presupuesto de Materiales Detallado: Pista de Drones FPV Recreativa (Capped $200k)

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
3. **Fondo de Reserva:** Les quedan libres **$28.320 CLP** para absorber pequeñas variaciones de precios en el retail o comprar rollos de cinta adhesiva adicionales si hiciera falta.$content$,
    NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_notes (id, project_id, title, content, file_url)
VALUES (
    'e5555555-5555-5555-5555-555555555552',
    'd5555555-5555-5555-5555-555555555555',
    'Propuesta Técnica: Pista de Drones Recreativa FPV (Edición DIY - Ultra Económica)',
    $content$# Propuesta Técnica: Pista de Drones Recreativa FPV (Edición DIY - Ultra Económica)

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
3. **Puntuación:** Los tiempos se registran y se aplican las penalizaciones según los QRs validados en el DVR.$content$,
    NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_notes (id, project_id, title, content, file_url)
VALUES (
    'e5555555-5555-5555-5555-555555555553',
    'd5555555-5555-5555-5555-555555555555',
    'Presentación del Evento: Experiencia y Dinámica de la Pista de Drones FPV',
    $content$# Presentación del Evento: Experiencia y Dinámica de la Pista de Drones FPV

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
4. **Resultados:** El tiempo de vuelo obtenido se complementa con las validaciones de los 4 códigos QR. El piloto con el menor tiempo total (tiempo registrado más penalizaciones, si las hubiera) liderará la tabla de posiciones del evento.
$content$,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- Estructura para Tabla de Ensayos de Proyecto (Agregado)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.project_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    columns JSONB NOT NULL DEFAULT '[]',
    rows JSONB NOT NULL DEFAULT '[]',
    cells JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar la tabla de ensayos semilla para el proyecto Recubrimiento SkyVtol
INSERT INTO public.project_trials (project_id, columns, rows, cells)
VALUES (
    'd2222222-2222-2222-2222-222222222222',
    '["Método", "Espesor / Capas", "Peso (g/m²)", "Resistencia Impacto", "Estado Visual", "Confirmado Por"]'::jsonb,
    '["Ensayo 1: Fibra + WBPU", "Ensayo 2: Papel Japón", "Ensayo 3: Masilla de Microesferas", "Ensayo 4: Doculam"]'::jsonb,
    '{"0_0": {"value": "Ensayo 1: Fibra + WBPU", "confirmed": false}, "1_0": {"value": "Ensayo 2: Papel Japón", "confirmed": false}, "2_0": {"value": "Ensayo 3: Masilla de Microesferas", "confirmed": false}, "3_0": {"value": "Ensayo 4: Doculam", "confirmed": false}}'::jsonb
) ON CONFLICT (project_id) DO NOTHING;


