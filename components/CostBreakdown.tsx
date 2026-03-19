import { ResultadoCalculo } from '@/lib/calculos'

interface Props {
  resultado: ResultadoCalculo
  origen: string
  destino: string
  dias: number
}

export default function CostBreakdown({ resultado, origen, destino, dias }: Props) {
  const { distancia, litros, costeFuel, costePeaje, costeComida, costeHotel, costeExtra, total, consejo } = resultado

  const fmt = (n: number) => '$' + n.toFixed(2)

  const items = [
    { icon: '⛽', label: 'Combustible', desc: `${litros.toFixed(1)} L`, coste: costeFuel, show: true },
    { icon: '🛣️', label: 'Peajes', desc: 'Estimado en autopistas', coste: costePeaje, show: costePeaje > 0 },
    { icon: '🍽️', label: 'Comida', desc: `35 €/día × ${dias} días`, coste: costeComida, show: costeComida > 0 },
    { icon: '🏨', label: 'Hospedaje', desc: `70 €/noche × ${Math.max(1, dias - 1)} noches`, coste: costeHotel, show: costeHotel > 0 },
    { icon: '🛠️', label: 'Imprevistos (10%)', desc: 'Reserva de seguridad', coste: costeExtra, show: costeExtra > 0 },
  ].filter(i => i.show)

  return (
    <div style={{
      background: '#2A2219',
      border: '1px solid rgba(232,88,10,0.2)',
      borderRadius: '12px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>

      {/* Título */}
      <p style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.2rem', letterSpacing: '2px',
        color: '#E8580A', marginBottom: '0.25rem',
      }}>Resumen</p>

      {/* Ruta */}
      <div style={{
        background: 'rgba(232,88,10,0.1)',
        border: '1px solid rgba(232,88,10,0.3)',
        borderRadius: '8px', padding: '1rem 1.25rem',
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.3rem', letterSpacing: '1px', color: '#F5F0E8',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {origen}
          <span style={{ color: '#E8580A' }}>→</span>
          {destino}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#8A7D72', marginTop: '4px' }}>
          {distancia.toLocaleString('es-ES')} km · {dias} día{dias > 1 ? 's' : ''}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', padding: '0.85rem 1.1rem',
          }}>
            <span style={{ fontSize: '1.2rem', width: '32px', textAlign: 'center' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#F5F0E8' }}>{item.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#8A7D72' }}>{item.desc}</div>
            </div>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.15rem', letterSpacing: '1px', color: '#F5F0E8',
            }}>{fmt(item.coste)}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{
        background: '#E8580A', borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>
            Coste Total Estimado
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
            {fmt(total / dias)} / día
          </div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'white', letterSpacing: '1px' }}>
          {fmt(total)}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#8A7D72' }}>
        * Estimación orientativa. Los precios reales pueden variar.
      </p>

      {/* Consejo */}
      <div style={{
        borderLeft: '3px solid #E8580A',
        paddingLeft: '0.75rem',
        fontSize: '0.82rem', color: '#8A7D72', lineHeight: 1.5,
      }}>
        <span style={{ color: '#F5F0E8', fontWeight: 500 }}>💡 Consejo: </span>{consejo}
      </div>
    </div>
  )
}