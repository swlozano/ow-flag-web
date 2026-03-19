'use client'

import { useState } from 'react'
import { calcularCoste, ResultadoCalculo } from '@/lib/calculos'
import CityAutocomplete from '@/components/CityAutocomplete'

interface Props {
  onResult: (resultado: ResultadoCalculo, origen: string, destino: string, dias: number) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: '46px', padding: '0 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#F5F0E8',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
  outline: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none', cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', letterSpacing: '1.5px',
  textTransform: 'uppercase', color: '#8A7D72', marginBottom: '6px',
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
  letterSpacing: '2px', color: '#E8580A', marginBottom: '1rem',
}

export default function RouteForm({ onResult }: Props) {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [cilindrada, setCilindrada] = useState('600')
  const [precioGas, setPrecioGas] = useState(1.72)
  const [dias, setDias] = useState(3)
  const [inclPeaje, setInclPeaje] = useState(true)
  const [inclComida, setInclComida] = useState(true)
  const [inclHotel, setInclHotel] = useState(true)
  const [inclExtra, setInclExtra] = useState(false)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!origen.trim() || !destino.trim()) {
      setError('Introduce el origen y el destino del viaje.')
      return
    }
    setError('')
    const resultado = calcularCoste({
      origen, destino, cilindrada, precioGas,
      dias, inclPeaje, inclComida, inclHotel, inclExtra,
    })
    onResult(resultado, origen, destino, dias)
  }

  const extras = [
    { label: '🛣️ Peajes', sub: 'Autopistas y vías de pago', val: inclPeaje, set: setInclPeaje },
    { label: '🍽️ Comida', sub: '~35 € por persona/día', val: inclComida, set: setInclComida },
    { label: '🏨 Hospedaje', sub: '~70 € por noche', val: inclHotel, set: setInclHotel },
    { label: '🛠️ Imprevistos', sub: '+10% reserva', val: inclExtra, set: setInclExtra },
  ]

  return (
    <div style={{
      background: '#2A2219',
      border: '1px solid rgba(232,88,10,0.2)',
      borderRadius: '12px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>

      {/* Ruta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <CityAutocomplete
          placeholder="Ciudad de origen…"
          value={origen}
          onChange={setOrigen}
        />
      <CityAutocomplete
        placeholder="Ciudad de destino…"
        value={destino}
        onChange={setDestino}
      />
    </div>

      {/* Moto */}
      <div>
        <p style={sectionTitleStyle}>Tu Moto</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Cilindrada</label>
            <div style={{ position: 'relative' }}>
              <select value={cilindrada} onChange={e => setCilindrada(e.target.value)} style={selectStyle}>
                <option value="125">125 cc</option>
                <option value="300">250–400 cc</option>
                <option value="600">500–700 cc</option>
                <option value="1000">800–1000 cc</option>
                <option value="1200">+1200 cc</option>
              </select>
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7D72', pointerEvents: 'none' }}>▾</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Precio gasolina (€/L)</label>
            <input
              type="number" value={precioGas} step="0.01" min="0.8" max="3"
              onChange={e => setPrecioGas(parseFloat(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Días */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={labelStyle}>Días de viaje</span>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#E8580A' }}>{dias}</span>
        </div>
        <input
          type="range" min="1" max="14" step="1" value={dias}
          onChange={e => setDias(parseInt(e.target.value))}
        />
      </div>

      {/* Extras */}
      <div>
        <p style={sectionTitleStyle}>Incluir</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {extras.map(item => (
            <button
              key={item.label}
              onClick={() => item.set(!item.val)}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: '8px',
                border: item.val ? '1px solid #E8580A' : '1px solid rgba(255,255,255,0.07)',
                background: item.val ? 'rgba(232,88,10,0.08)' : 'rgba(255,255,255,0.02)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#F5F0E8', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#8A7D72' }}>{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{
          background: 'rgba(200,30,30,0.15)', border: '1px solid rgba(200,30,30,0.4)',
          borderRadius: '8px', padding: '0.75rem 1rem', color: '#f97070', fontSize: '0.85rem',
        }}>⚠️ {error}</p>
      )}

      <button
        onClick={handleCalcular}
        style={{
          width: '100%', height: '52px', background: '#E8580A',
          border: 'none', borderRadius: '8px', color: 'white',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
          letterSpacing: '2px', cursor: 'pointer',
        }}
      >
        CALCULAR COSTE
      </button>
    </div>
  )
}