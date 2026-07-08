-- Actualizar registros existentes con estado 'purchased' a 'approved'
UPDATE materials SET status = 'approved' WHERE status = 'purchased';

-- Eliminar la restricción de check anterior si existe
ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_status_check;

-- Agregar la nueva restricción para 'status' (aprobación) incluyendo 'rejected'
ALTER TABLE materials ADD CONSTRAINT materials_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

-- Agregar la columna 'purchase_status'
ALTER TABLE materials ADD COLUMN IF NOT EXISTS purchase_status TEXT CHECK (purchase_status IN ('por_comprar', 'pedido', 'disponible'));

-- Inicializar purchase_status para materiales que ya están aprobados
UPDATE materials SET purchase_status = 'por_comprar' WHERE status = 'approved' AND purchase_status IS NULL;
