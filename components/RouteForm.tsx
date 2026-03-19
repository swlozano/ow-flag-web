'use client'

import { useState } from 'react'
import { calcularCoste, ResultadoCalculo } from '@/lib/calculos'
import CityAutocomplete from '@/components/CityAutocomplete'
import CountrySelector from '@/components/CountrySelector'
import TripStyleSelector from '@/components/TripStyleSelector'

interface CalcResult {
  countryData: {
    code: string
    name: string
    fuelPrice: number
    foodPricePerDay: number
    hotelPricePerNight: number
    consumption: number
  }[]
}

interface Props {
  onResult: (resultado: CalcResult, data: {
    kmPerDay: number
    dias: number
    inclComida: boolean
    inclHotel: boolean
    inclExtra: boolean
    extraCosts: number
  }) => void
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
  const [countries, setCountries] = useState<{ code: string, name: string, capital: string }[]>([])
  const [tripStyle, setTripStyle] = useState('estandar')
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
  const [extraCosts, setExtraCosts] = useState(0)
  const [kmPerDay, setKmPerDay] = useState(300)
  const [loading, setLoading] = useState(false)

  async function handleCalcular() {
    if (countries.length < 1) {
      setError('Select at least 1 countries.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries,
          cilindrada,
          dias,
          inclPeaje,
          inclComida,
          inclHotel,
          inclExtra,
          tripStyle,
          extraCosts,
          kmPerDay,
        }),
      })

      const data = await res.json()
      if (data.error) {
        setError('Error calculating route. Try again.')
        return
      }



      onResult(data, {
        kmPerDay,
        dias,
        inclComida,
        inclHotel,
        inclExtra,
        extraCosts,
      })

    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const extras = [
    { label: '🍽️ Comida', sub: '', val: inclComida, set: setInclComida },
    { label: '🏨 Hospedaje', sub: '', val: inclHotel, set: setInclHotel },
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


      {/* Route */}
      <div>
        <p style={sectionTitleStyle}>Route</p>
        <CountrySelector value={countries} onChange={setCountries} />
      </div>

      {/* Style */}
      <div>
        <p style={sectionTitleStyle}>Estilo de viaje</p>
        <TripStyleSelector value={tripStyle} onChange={setTripStyle} />
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

        </div>
      </div>

      {/* Días */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={labelStyle}>Días de viaje por </span>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#E8580A' }}>{dias}</span>
        </div>
        <input
          type="range" min="1" max="14" step="1" value={dias}
          onChange={e => setDias(parseInt(e.target.value))}
        />
      </div>

      {/*KM por días*/}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={labelStyle}>Kilómetros a recorrer por día</label>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#E8580A' }}>
            {kmPerDay} km
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="600"
          step="25"
          value={kmPerDay}
          onChange={e => setKmPerDay(parseInt(e.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: '#8A7D72' }}>50 km</span>
          <span style={{ fontSize: '0.7rem', color: '#8A7D72' }}>600 km</span>
        </div>
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

      {/*Add extras*/}
      <div>
        <p style={sectionTitleStyle}>Costos Adicionales</p>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)',
            color: '#8A7D72', fontSize: '0.95rem',
          }}>$</span>
          <input
            type="number"
            value={extraCosts || ''}
            onChange={e => setExtraCosts(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            style={{
              ...inputStyle,
              paddingLeft: '28px',
            }}
          />
        </div>
        <p style={{ fontSize: '0.72rem', color: '#8A7D72', marginTop: '6px' }}>
          Tasas fronterizas, SOAT, aduanas o cualquier otro gasto
        </p>
      </div>

      {error && (
        <p style={{
          background: 'rgba(200,30,30,0.15)', border: '1px solid rgba(200,30,30,0.4)',
          borderRadius: '8px', padding: '0.75rem 1rem', color: '#f97070', fontSize: '0.85rem',
        }}>⚠️ {error}</p>
      )}

      <button
        onClick={handleCalcular}
        disabled={loading}
        style={{
          width: '100%', height: '52px',
          background: loading ? '#8A7D72' : '#E8580A',
          border: 'none', borderRadius: '8px', color: 'white',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
          letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'CALCULANDO...' : 'CALCULAR COSTE'}
      </button>
    </div>
  )
}