'use client'

import { useState, useEffect } from 'react'

interface CountryData {
  code: string
  name: string
  fuelPrice: number
  foodPricePerDay: number
  hotelPricePerNight: number
  consumption: number
}

interface CountryRow {
  code: string
  name: string
  dias: number
  kmPerDay: number
  fuelPrice: number
  foodPricePerDay: number
  hotelPricePerNight: number
  consumption: number
}

interface Props {
  countryData: CountryData[]
  defaultKmPerDay: number
  defaultDias: number
  inclComida: boolean
  inclHotel: boolean
  inclExtra: boolean
  extraCosts: number
}

export default function CostBreakdown({
  countryData, defaultKmPerDay, defaultDias,
  inclComida, inclHotel, inclExtra, extraCosts
}: Props) {

  const diasPerCountry = Math.max(1, Math.floor(defaultDias / countryData.length))

  const [rows, setRows] = useState<CountryRow[]>(() =>
    countryData.map(c => ({
      ...c,
      dias: diasPerCountry,
      kmPerDay: defaultKmPerDay,
    }))
  )

  useEffect(() => {
    setRows(countryData.map(c => ({
      ...c,
      dias: Math.max(1, Math.floor(defaultDias / countryData.length)),
      kmPerDay: defaultKmPerDay,
    })))
  }, [countryData, defaultKmPerDay, defaultDias])

  function updateRow(index: number, field: 'dias' | 'kmPerDay', value: number) {
    const updated = [...rows]
    updated[index] = { ...updated[index], [field]: value }
    setRows(updated)
  }

  function calcRow(row: CountryRow) {
    const km = row.kmPerDay * row.dias
    const liters = (km / 100) * row.consumption
    const costFuel = liters * row.fuelPrice
    const costFood = inclComida ? row.foodPricePerDay * row.dias : 0
    const costHotel = inclHotel ? row.hotelPricePerNight * Math.max(1, row.dias - 1) : 0
    const subtotal = costFuel + costFood + costHotel
    return { km, liters, costFuel, costFood, costHotel, subtotal }
  }

  const calculated = rows.map(calcRow)
  const totalKm = calculated.reduce((s, r) => s + r.km, 0)
  const totalFuel = calculated.reduce((s, r) => s + r.costFuel, 0)
  const totalFood = calculated.reduce((s, r) => s + r.costFood, 0)
  const totalHotel = calculated.reduce((s, r) => s + r.costHotel, 0)
  const subtotal = totalFuel + totalFood + totalHotel
  const totalExtra = inclExtra ? subtotal * 0.1 : 0
  const total = subtotal + totalExtra + (extraCosts || 0)

  const fmt = (n: number) => '$' + n.toFixed(2)

  const inputStyle: React.CSSProperties = {
    width: '60px',
    height: '30px',
    padding: '0 6px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#F5F0E8',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.82rem',
    textAlign: 'center',
    outline: 'none',
  }

  return (
    <div style={{
      background: '#2A2219',
      border: '1px solid rgba(232,88,10,0.2)',
      borderRadius: '12px',
      padding: '2rem',
    }}>
      <p style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.2rem', letterSpacing: '2px',
        color: '#E8580A', marginBottom: '1.5rem',
      }}>Resumen del viaje</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['País', 'Días', 'Km/día', '⛽', '🍽️', '🏨', 'Subtotal'].map(h => (
                <th key={h} style={{
                  padding: '8px 10px',
                  textAlign: h === 'País' ? 'left' : 'right',
                  color: '#8A7D72',
                  fontWeight: 500,
                  fontSize: '0.72rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const calc = calculated[i]
              return (
                <tr key={row.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px', color: '#F5F0E8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={`https://flagcdn.com/20x15/${row.code.toLowerCase()}.png`}
                        alt={row.name}
                        style={{ width: '18px', height: '13px', borderRadius: '2px' }}
                      />
                      {row.name}
                    </div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <input
                      type="number"
                      value={row.dias}
                      min={1}
                      max={30}
                      onChange={e => updateRow(i, 'dias', parseInt(e.target.value) || 1)}
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <input
                      type="number"
                      value={row.kmPerDay}
                      min={50}
                      max={600}
                      step={25}
                      onChange={e => updateRow(i, 'kmPerDay', parseInt(e.target.value) || 50)}
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(calc.costFuel)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(calc.costFood)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(calc.costHotel)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#E8580A', fontWeight: 600 }}>{fmt(calc.subtotal)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '1px solid rgba(232,88,10,0.3)', background: 'rgba(232,88,10,0.06)' }}>
              <td style={{ padding: '12px', color: '#F5F0E8', fontWeight: 600 }}>Total</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#8A7D72' }}>
                {rows.reduce((s, r) => s + r.dias, 0)} días
              </td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#8A7D72' }}>{totalKm} km</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(totalFuel)}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(totalFood)}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#F5F0E8' }}>{fmt(totalHotel)}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#E8580A', fontWeight: 700, fontSize: '1rem' }}>{fmt(subtotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {inclExtra && (
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          padding: '0 12px',
          color: '#8A7D72',
        }}>
          <span>🛠️ Imprevistos (10%)</span>
          <span style={{ color: '#F5F0E8' }}>{fmt(totalExtra)}</span>
        </div>
      )}

      {extraCosts > 0 && (
        <div style={{
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          padding: '0 12px',
          color: '#8A7D72',
        }}>
          <span>➕ Gastos extras</span>
          <span style={{ color: '#F5F0E8' }}>{fmt(extraCosts)}</span>
        </div>
      )}

      <div style={{
        marginTop: '1.25rem',
        background: '#E8580A',
        borderRadius: '10px',
        padding: '1.1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
            Coste Total Estimado
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
            {fmt(total / Math.max(1, rows.reduce((s, r) => s + r.dias, 0)))} / día
          </div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'white', letterSpacing: '1px' }}>
          {fmt(total)}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#8A7D72', marginTop: '1rem' }}>
        * Estimación orientativa. Los precios reales pueden variar.
      </p>
    </div>
  )
}