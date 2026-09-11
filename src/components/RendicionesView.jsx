import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, Wallet, CheckCircle2, Clock, AlertCircle, Plus, 
  ArrowRight, FileText, Download, Eye, ExternalLink, Calendar,
  CreditCard, Shield, ChevronRight, X, Sparkles, Building2, User,
  Check, RefreshCw, Layers, DollarSign, Filter, Lock
} from 'lucide-react';
import { dbService } from '../services/db';
import { getTeamMember } from '../services/team';

export default function RendicionesView({
  currentProfile,
  isAdmin,
  authenticatedUser,
  onNavigate,
  onOpenAuthModal
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modales
  const [isNewGastoModalOpen, setIsNewGastoModalOpen] = useState(false);
  const [isCorteModalOpen, setIsCorteModalOpen] = useState(false);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedGasto, setSelectedGasto] = useState(null);

  // Formulario nuevo gasto
  const [newGastoForm, setNewGastoForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proveedor: '',
    monto: '',
    descripcionItem: '',
    archivo: '',
    notas: ''
  });

  // Formulario corte rendición
  const [corteForm, setCorteForm] = useState({
    titulo: '',
    notas: ''
  });

  // Formulario pago transferencia
  const [pagoForm, setPagoForm] = useState({
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    nOperacion: '',
    archivo: '',
    corteId: '',
    notas: ''
  });

  // Acceso autorizado solo para Mateo o Nicolás Pazols
  const isAuthorized = currentProfile === 'mateo' || currentProfile === 'nicolas' || authenticatedUser === 'mateo' || authenticatedUser === 'nicolas' || isAdmin;

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await dbService.getRendicionesData();
      setData(res);
    } catch (err) {
      console.error('Error cargando rendiciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Formateador CLP
  const formatCLP = (val) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Manejar creación de gasto
  const handleCreateGasto = async (e) => {
    e.preventDefault();
    if (!newGastoForm.proveedor.trim() || !newGastoForm.monto) return;
    try {
      await dbService.addGastoRendicion({
        fecha: newGastoForm.fecha,
        proveedor: newGastoForm.proveedor.trim(),
        monto: Number(newGastoForm.monto),
        archivo: newGastoForm.archivo.trim() || null,
        notas: newGastoForm.notas.trim(),
        items: [
          {
            descripcion: newGastoForm.descripcionItem.trim() || newGastoForm.proveedor.trim(),
            total: Number(newGastoForm.monto)
          }
        ]
      });
      setIsNewGastoModalOpen(false);
      setNewGastoForm({
        fecha: new Date().toISOString().split('T')[0],
        proveedor: '',
        monto: '',
        descripcionItem: '',
        archivo: '',
        notas: ''
      });
      await loadData();
    } catch (err) {
      alert('Error guardando la boleta: ' + err.message);
    }
  };

  // Manejar creación de corte formal de rendición
  const handleCreateCorte = async (e) => {
    e.preventDefault();
    try {
      await dbService.createCorteRendicion({
        titulo: corteForm.titulo.trim() || `Rendición ${new Date().toLocaleDateString('es-CL')}`,
        notas: corteForm.notas.trim()
      });
      setIsCorteModalOpen(false);
      setCorteForm({ titulo: '', notas: '' });
      await loadData();
    } catch (err) {
      alert('Error al generar la rendición: ' + err.message);
    }
  };

  // Manejar registro de pago/transferencia
  const handleRegisterPago = async (e) => {
    e.preventDefault();
    if (!pagoForm.monto) return;
    try {
      await dbService.registerPagoSkydrone({
        monto: Number(pagoForm.monto),
        fecha: pagoForm.fecha,
        nOperacion: pagoForm.nOperacion.trim(),
        archivo: pagoForm.archivo.trim() || null,
        corteId: pagoForm.corteId || null,
        notas: pagoForm.notas.trim()
      });
      setIsPagoModalOpen(false);
      setPagoForm({
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
        nOperacion: '',
        archivo: '',
        corteId: '',
        notas: ''
      });
      await loadData();
    } catch (err) {
      alert('Error al registrar el pago: ' + err.message);
    }
  };

  // Si no está autorizado, pantalla de seguridad
  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: '680px', margin: '4rem auto', padding: '0 1rem' }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
            Acceso Exclusivo de Rendiciones
          </h2>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Esta sección contiene información financiera sensible, comprobantes de gastos y conciliación de reembolsos directos entre <strong>Mateo</strong> y <strong>Nicolás Pazols (Skydrone SpA)</strong>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal(getTeamMember('mateo'))}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>👨‍💻 Ingresar como Mateo</span>
            </button>
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal(getTeamMember('nicolas'))}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#0284c7', color: '#38bdf8' }}
            >
              <span>🦅 Ingresar como Nicolás</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Agrupación para el Cronograma / Árbol de Rendiciones
  const gastos = data?.gastos || [];
  const cortes = data?.cortes || [];
  const transferencias = data?.transferencias || [];
  const totales = data?.totales || { totalGastado: 0, totalReembolsado: 0, saldoPendientePorCobrar: 0 };

  const gastosSinRendir = gastos.filter(g => !g.rendido);
  const totalSinRendir = gastosSinRendir.reduce((s, g) => s + Number(g.monto || 0), 0);

  return (
    <div style={{ padding: '0 0 4rem 0' }}>
      {/* 1. CABECERA Y KPI CARDS */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(2, 132, 199, 0.05) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📑</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Control de Rendiciones & Reembolsos
              </h2>
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(2, 132, 199, 0.25)',
                color: '#38bdf8',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                Skydrone SpA
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', margin: 0, fontSize: '0.9rem', maxWidth: '640px' }}>
              Flujo cronológico de emisión de boletas, cortes de rendición formal y conciliación de transferencias de reembolso entre Mateo y Nicolás Pazols.
            </p>
          </div>

          {/* Acciones principales */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsNewGastoModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
            >
              <Plus size={15} />
              <span>Ingresar Boleta</span>
            </button>
            
            <button
              onClick={() => setIsCorteModalOpen(true)}
              disabled={gastosSinRendir.length === 0}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                borderColor: '#eab308',
                color: gastosSinRendir.length === 0 ? 'var(--text-muted)' : '#facc15',
                cursor: gastosSinRendir.length === 0 ? 'not-allowed' : 'pointer'
              }}
              title={gastosSinRendir.length === 0 ? 'No hay boletas pendientes de corte' : 'Generar corte de rendición formal para Skydrone'}
            >
              <FileText size={15} />
              <span>Hacer Rendición ({gastosSinRendir.length})</span>
            </button>

            <button
              onClick={() => setIsPagoModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#10b981', color: '#34d399' }}
            >
              <CreditCard size={15} />
              <span>Registrar Pago Nico</span>
            </button>

            <a
              href="/rendiciones/INFORME_GASTOS_Y_PAGOS.csv"
              download="INFORME_GASTOS_Y_PAGOS.csv"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Descargar CSV conciliado"
            >
              <Download size={14} />
              <span>CSV</span>
            </a>
          </div>
        </div>

        {/* Tarjetas de Balance Superior */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Total Gastos */}
          <div className="card" style={{ padding: '1.1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Compras Registradas</span>
              <Receipt size={16} style={{ color: '#0ea5e9' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {formatCLP(totales.totalGastado)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {gastos.length} ítems / boletas en total
            </div>
          </div>

          {/* Total Reembolsado */}
          <div className="card" style={{ padding: '1.1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Reembolsado por Skydrone</span>
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
              {formatCLP(totales.totalReembolsado)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {transferencias.length} transferencia(s) recibida(s)
            </div>
          </div>

          {/* Saldo Pendiente de Pago */}
          <div className="card" style={{ padding: '1.1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 600 }}>Pendiente por Reembolsar</span>
              <Clock size={16} style={{ color: '#f97316' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb923c' }}>
              {formatCLP(totales.saldoPendientePorCobrar)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Falta que Nicolás te pague
            </div>
          </div>

          {/* Sin Rendir Aún */}
          <div className="card" style={{ padding: '1.1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>Boletas Nuevas sin Rendir</span>
              <Layers size={16} style={{ color: '#38bdf8' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
              {formatCLP(totalSinRendir)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {gastosSinRendir.length} boleta(s) listas para rendición
            </div>
          </div>
        </div>
      </div>

      {/* 2. CRONOGRAMA INTERACTIVO / ÁRBOL DE RENDICIONES & PAGOS */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌳</span> Cronograma: Línea de Boletas, Rendición y Pago
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Visualización por lotes: las boletas se van emitiendo en secuencia; la rendición corta el lote y el pago de Nico cubre exactamente las boletas rendidas.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></span> Pagado
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#facc15' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308' }}></span> Rendido (Esperando pago)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0ea5e9' }}></span> Boleta emitida sin rendir
            </span>
          </div>
        </div>

        {/* PIPELINE / SWIMLANE CONTENEDOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* CICLO 1: LOTE RENDIDO Y PAGADO CON TRANSF 220.000 */}
          {cortes.map((corte, idx) => {
            const gastosDelCorte = gastos.filter(g => corte.gastoIds?.includes(g.id) || g.corteId === corte.id);
            const transfDelCorte = transferencias.find(t => t.id === corte.transferenciaId);

            return (
              <div 
                key={corte.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '14px',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1rem' }}>📌</span>
                    <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>
                      Ciclo {idx + 1}: {corte.titulo}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Fecha: {corte.fecha}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '10px',
                      backgroundColor: corte.estado === 'PAGADO' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: corte.estado === 'PAGADO' ? '#34d399' : '#facc15',
                      fontWeight: 700,
                      border: `1px solid ${corte.estado === 'PAGADO' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`
                    }}>
                      {corte.estado === 'PAGADO' ? '✓ REEMBOLSADO' : '⏳ PENDIENTE DE REEMBOLSO'}
                    </span>
                  </div>
                </div>

                {/* FLUJO HORIZONTAL DE BOLETAS Y PAGO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '0.5rem 0 1rem 0' }}>
                  {gastosDelCorte.map((gasto, gIdx) => (
                    <React.Fragment key={gasto.id}>
                      {/* Nodo Boleta */}
                      <div
                        onClick={() => setSelectedGasto(gasto)}
                        style={{
                          minWidth: '190px',
                          maxWidth: '220px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          borderRadius: '10px',
                          padding: '0.8rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }}
                        className="dropdown-item-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{gasto.fecha}</span>
                          <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>PAGADO</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {gasto.proveedor}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', height: '2.2rem', overflow: 'hidden' }}>
                          {gasto.items?.[0]?.descripcion || gasto.notas}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.4rem' }}>
                          <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>
                            {formatCLP(gasto.monto)}
                          </strong>
                          {gasto.archivo && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(gasto.archivo);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', padding: 2 }}
                              title="Ver Comprobante"
                            >
                              <Eye size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Flecha conectora entre boletas */}
                      {gIdx < gastosDelCorte.length - 1 && (
                        <div style={{ color: 'rgba(16, 185, 129, 0.5)', flexShrink: 0 }}>
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {/* FLECHA AL HITO DE CORTE DE RENDICIÓN */}
                  <div style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, padding: '0 0.5rem' }}>
                    <div style={{ width: 16, height: 2, backgroundColor: '#eab308' }}></div>
                    <ArrowRight size={18} />
                  </div>

                  {/* HITO DE CORTE DE RENDICIÓN */}
                  <div style={{
                    minWidth: '180px',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    border: '2px dashed #eab308',
                    borderRadius: '10px',
                    padding: '0.8rem',
                    flexShrink: 0,
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#facc15', fontWeight: 800 }}>
                      ⚡ CORTE RENDICIÓN
                    </span>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0.3rem 0' }}>
                      {formatCLP(corte.montoTotal)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Total {gastosDelCorte.length} boletas
                    </div>
                  </div>

                  {/* FLECHA AL HITO DE PAGO DE NICOLÁS */}
                  <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, padding: '0 0.5rem' }}>
                    <div style={{ width: 24, height: 2, backgroundColor: '#10b981' }}></div>
                    <ArrowRight size={18} />
                  </div>

                  {/* HITO DE PAGO TRANSFERENCIA NICOLÁS */}
                  <div style={{
                    minWidth: '220px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '0.9rem',
                    flexShrink: 0,
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.25)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Check size={12} /> PAGO SKYDRONE
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {transfDelCorte?.fecha || corte.fecha}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                      {formatCLP(transfDelCorte?.monto || corte.montoTotal)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Op: {transfDelCorte?.nOperacion || '6032572678'}
                    </div>
                    {transfDelCorte?.archivo && (
                      <button
                        onClick={() => setPreviewImage(transfDelCorte.archivo)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.7rem', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={12} /> Ver Transferencia
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* CICLO 2: BOLETAS NUEVAS EN CURSO (PENDIENTES DE PAGO / PRÓXIMO CORTE) */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1rem' }}>⏳</span>
                <strong style={{ color: '#fb923c', fontSize: '0.95rem' }}>
                  Ciclo Actual: Boletas Emitidas Pendientes de Pago
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total acumulado: {formatCLP(totales.saldoPendientePorCobrar)}
                </span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                color: '#fb923c',
                fontWeight: 700,
                border: '1px solid rgba(249, 115, 22, 0.3)'
              }}>
                PENDIENTE DE REEMBOLSO
              </span>
            </div>

            {/* FLUJO HORIZONTAL DE BOLETAS NO PAGADAS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '0.5rem 0 1rem 0' }}>
              {gastos.filter(g => g.estado !== 'PAGADO').map((gasto, gIdx, arr) => (
                <React.Fragment key={gasto.id}>
                  <div
                    onClick={() => setSelectedGasto(gasto)}
                    style={{
                      minWidth: '190px',
                      maxWidth: '220px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      borderRadius: '10px',
                      padding: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    className="dropdown-item-hover"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{gasto.fecha}</span>
                      <span style={{ fontSize: '0.68rem', color: '#fb923c', fontWeight: 700 }}>
                        {gasto.rendido ? 'RENDIDO' : 'POR RENDIR'}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {gasto.proveedor}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', height: '2.2rem', overflow: 'hidden' }}>
                      {gasto.items?.[0]?.descripcion || gasto.notas}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.4rem' }}>
                      <strong style={{ color: '#fb923c', fontSize: '0.85rem' }}>
                        {formatCLP(gasto.monto)}
                      </strong>
                      {gasto.archivo ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(gasto.archivo);
                          }}
                          style={{ background: 'none', border: 'none', color: '#fb923c', cursor: 'pointer', display: 'flex', padding: 2 }}
                          title="Ver Boleta"
                        >
                          <Eye size={13} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Traslado</span>
                      )}
                    </div>
                  </div>

                  {/* Flecha conectora */}
                  {gIdx < arr.length - 1 && (
                    <div style={{ color: 'rgba(249, 115, 22, 0.4)', flexShrink: 0 }}>
                      <ArrowRight size={16} />
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* SIGUIENTE PASO EN EL CRONOGRAMA: CORTE O TRANSFERENCIA PENDIENTE */}
              <div style={{ color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, padding: '0 0.5rem' }}>
                <div style={{ width: 16, height: 2, backgroundColor: '#f97316', borderTop: '2px dashed #f97316' }}></div>
                <ArrowRight size={18} />
              </div>

              {/* HITO PENDIENTE DE REEMBOLSO */}
              <div style={{
                minWidth: '200px',
                backgroundColor: 'rgba(249, 115, 22, 0.08)',
                border: '2px dashed rgba(249, 115, 22, 0.5)',
                borderRadius: '12px',
                padding: '0.9rem',
                flexShrink: 0,
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#fb923c', fontWeight: 800 }}>
                  ⏳ PAGO PENDIENTE
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fb923c', margin: '0.25rem 0' }}>
                  {formatCLP(totales.saldoPendientePorCobrar)}
                </div>
                <button
                  onClick={() => {
                    setPagoForm(prev => ({ ...prev, monto: totales.saldoPendientePorCobrar }));
                    setIsPagoModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', marginTop: '0.35rem', borderColor: '#fb923c', color: '#fb923c' }}
                >
                  Registrar Reembolso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABLA DE DETALLE DE GASTOS Y BOLETAS */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> Registro Detallado de Boletas & Comprobantes
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Mostrando {gastos.length} comprobantes
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Proveedor</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Detalle de Compra</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Monto (CLP)</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto) => {
                const isPagado = gasto.estado === 'PAGADO';
                return (
                  <tr 
                    key={gasto.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s' }}
                    className="dropdown-item-hover"
                  >
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{gasto.fecha}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#f8fafc' }}>{gasto.proveedor}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                      {gasto.items?.map((it, i) => (
                        <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          • {it.descripcion} {it.total ? `(${formatCLP(it.total)})` : ''}
                        </div>
                      )) || gasto.notas}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: isPagado ? '#34d399' : '#fb923c' }}>
                      {formatCLP(gasto.monto)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '8px',
                        backgroundColor: isPagado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                        color: isPagado ? '#34d399' : '#fb923c',
                        fontWeight: 700
                      }}>
                        {isPagado ? 'PAGADO' : 'PENDIENTE'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {gasto.archivo ? (
                        <button
                          onClick={() => setPreviewImage(gasto.archivo)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={12} /> Ver Boleta
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin adjunto</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: INGRESAR NUEVA BOLETA --- */}
      {isNewGastoModalOpen && (
        <div className="inspector-drawer-backdrop" onClick={() => setIsNewGastoModalOpen(false)}>
          <div 
            className="card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              width: '90%',
              margin: 'auto',
              borderRadius: '16px',
              padding: '1.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🧾</span> Ingresar Nueva Boleta / Gasto
              </h3>
              <button 
                onClick={() => setIsNewGastoModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGasto} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Proveedor / Tienda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MercadoLibre, Sodimac, AliExpress, Pinturas Motta"
                  value={newGastoForm.proveedor}
                  onChange={(e) => setNewGastoForm({ ...newGastoForm, proveedor: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={newGastoForm.fecha}
                    onChange={(e) => setNewGastoForm({ ...newGastoForm, fecha: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Monto (CLP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ej: 32000"
                    value={newGastoForm.monto}
                    onChange={(e) => setNewGastoForm({ ...newGastoForm, monto: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Descripción o Ítems Comprados
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pistola de pintura + Masilla poliéster"
                  value={newGastoForm.descripcionItem}
                  onChange={(e) => setNewGastoForm({ ...newGastoForm, descripcionItem: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Ruta o Nombre de la Imagen de Boleta
                </label>
                <input
                  type="text"
                  placeholder="Ej: /rendiciones/boletas/comprobante_2026-08-24.png"
                  value={newGastoForm.archivo}
                  onChange={(e) => setNewGastoForm({ ...newGastoForm, archivo: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Notas o Justificación
                </label>
                <textarea
                  rows="2"
                  placeholder="Ej: Comprado para el acabado de pintura del fuselaje Betol."
                  value={newGastoForm.notas}
                  onChange={(e) => setNewGastoForm({ ...newGastoForm, notas: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewGastoModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar Boleta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: GENERAR CORTE DE RENDICIÓN --- */}
      {isCorteModalOpen && (
        <div className="inspector-drawer-backdrop" onClick={() => setIsCorteModalOpen(false)}>
          <div 
            className="card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '90%',
              margin: 'auto',
              borderRadius: '16px',
              padding: '1.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid #eab308'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📑</span> Emitir Corte de Rendición
              </h3>
              <button 
                onClick={() => setIsCorteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Se cortará la lista con <strong>{gastosSinRendir.length} boletas</strong> acumuladas sin rendir, sumando un total de <strong>{formatCLP(totalSinRendir)}</strong>.
            </p>

            <form onSubmit={handleCreateCorte} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Título de la Rendición
                </label>
                <input
                  type="text"
                  placeholder={`Ej: Rendición Septiembre - Insumos y Pintura`}
                  value={corteForm.titulo}
                  onChange={(e) => setCorteForm({ ...corteForm, titulo: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Notas para Nicolás
                </label>
                <textarea
                  rows="3"
                  placeholder="Ej: Incluye pistola de pintura y compras de materiales para la entrega de fin de mes."
                  value={corteForm.notas}
                  onChange={(e) => setCorteForm({ ...corteForm, notas: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCorteModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#eab308', borderColor: '#eab308', color: '#0f172a', fontWeight: 700 }}
                >
                  Confirmar y Rendir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: REGISTRAR PAGO DE NICOLÁS --- */}
      {isPagoModalOpen && (
        <div className="inspector-drawer-backdrop" onClick={() => setIsPagoModalOpen(false)}>
          <div 
            className="card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '90%',
              margin: 'auto',
              borderRadius: '16px',
              padding: '1.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid #10b981'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💸</span> Registrar Reembolso de Skydrone
              </h3>
              <button 
                onClick={() => setIsPagoModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterPago} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Monto Transferido (CLP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pagoForm.monto}
                    onChange={(e) => setPagoForm({ ...pagoForm, monto: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={pagoForm.fecha}
                    onChange={(e) => setPagoForm({ ...pagoForm, fecha: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  N° de Operación Bancaria
                </label>
                <input
                  type="text"
                  placeholder="Ej: 6032572678"
                  value={pagoForm.nOperacion}
                  onChange={(e) => setPagoForm({ ...pagoForm, nOperacion: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Comprobante de Transferencia (Ruta de imagen)
                </label>
                <input
                  type="text"
                  placeholder="/rendiciones/boletas/transferencia_2026-08-28.png"
                  value={pagoForm.archivo}
                  onChange={(e) => setPagoForm({ ...pagoForm, archivo: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsPagoModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 700 }}
                >
                  Guardar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VISOR DE IMAGEN DE COMPROBANTE --- */}
      {previewImage && (
        <div 
          className="inspector-drawer-backdrop" 
          onClick={() => setPreviewImage(null)}
          style={{ zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              backgroundColor: '#0b1120',
              padding: '1rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <img 
              src={previewImage} 
              alt="Comprobante" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
              <a
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}
              >
                <ExternalLink size={13} /> Abrir en pestaña nueva
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
