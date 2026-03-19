'use client'

interface TripStyle {
  id: string
  label: string
  desc: string
  icon: string
}

const TRIP_STYLES: TripStyle[] = [
  {
    id: 'economico',
    label: 'Económico',
    desc: 'Camping, comida local, sin autopistas',
    icon: '🏕️',
  },
  {
    id: 'estandar',
    label: 'Estándar',
    desc: 'Hostales, restaurantes, algún peaje',
    icon: '🏍️',
  },
  {
    id: 'premium',
    label: 'Premium',
    desc: 'Hoteles, restaurantes, autopistas',
    icon: '⭐',
  },
]

interface Props {
  value: string
  onChange: (style: string) => void
}

export default function TripStyleSelector({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
      {TRIP_STYLES.map(style => {
        const selected = value === style.id
        return (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            style={{
              padding: '0.9rem 0.75rem',
              borderRadius: '8px',
              border: selected ? '1px solid #E8580A' : '1px solid rgba(255,255,255,0.1)',
              background: selected ? 'rgba(232,88,10,0.12)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{style.icon}</div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: selected ? '#E8580A' : '#F5F0E8',
              marginBottom: '4px',
            }}>
              {style.label}
            </div>
        
          </button>
        )
      })}
    </div>
  )
}