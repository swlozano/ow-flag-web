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

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggleCollapse(code: string) {
    setCollapsed(prev => ({ ...prev, [code]: !prev[code] }))
  }

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
  const totalFuel = calculated.reduce((s, r) => s + r.costFuel, 0)
  const totalFood = calculated.reduce((s, r) => s + r.costFood, 0)
  const totalHotel = calculated.reduce((s, r) => s + r.costHotel, 0)
  const subtotal = totalFuel + totalFood + totalHotel
  const totalExtra = inclExtra ? subtotal * 0.1 : 0
  const total = subtotal + totalExtra + (extraCosts || 0)
  const totalDias = rows.reduce((s, r) => s + r.dias, 0)

  const fmt = (n: number) => '$' + n.toFixed(2)

  const inputStyle: React.CSSProperties = {
    width: '60px', height: '30px', padding: '0 6px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', color: '#F5F0E8',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.82rem', textAlign: 'center', outline: 'none',
  }

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
      <p style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: '1.2rem', letterSpacing: '2px',
        color: '#E8580A',
      }}>Resumen del viaje</p>

      {/* Cards por país */}
      {rows.map((row, i) => {
        const calc = calculated[i]
        const isCollapsed = collapsed[row.code]

        return (
          <div key={row.code} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {/* Header — siempre visible */}
            <div
              onClick={() => toggleCollapse(row.code)}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={`https://flagcdn.com/20x15/${row.code.toLowerCase()}.png`}
                  alt={row.name}
                  style={{ width: '20px', height: '15px', borderRadius: '2px' }}
                />
                <span style={{ color: '#F5F0E8', fontWeight: 500, fontSize: '0.95rem' }}>
                  {row.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8A7D72' }}>
                  {row.dias} días · {row.kmPerDay} km/día
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.1rem', color: '#E8580A', letterSpacing: '1px',
                }}>
                  {fmt(calc.subtotal)}
                </span>
                <span style={{
                  color: '#8A7D72', fontSize: '0.8rem',
                  transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                }}>▾</span>
              </div>
            </div>

            {/* Contenido colapsable */}
            {!isCollapsed && (
              <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

                {/* Inputs días y km */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem', margin: '0.75rem 0',
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#8A7D72', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Días</div>
                    <input
                      type="number" value={row.dias} min={1} max={30}
                      onChange={e => updateRow(i, 'dias', parseInt(e.target.value) || 1)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#8A7D72', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Km/día</div>
                    <input
                      type="number" value={row.kmPerDay} min={50} max={600} step={25}
                      onChange={e => updateRow(i, 'kmPerDay', parseInt(e.target.value) || 50)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                </div>

                {/* Desglose */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#8A7D72' }}>⛽ Combustible ({calc.km} km)</span>
                    <span style={{ color: '#F5F0E8' }}>{fmt(calc.costFuel)}</span>
                  </div>
                  {inclComida && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: '#8A7D72' }}>🍽️ Comida ({row.dias} días)</span>
                      <span style={{ color: '#F5F0E8' }}>{fmt(calc.costFood)}</span>
                    </div>
                  )}
                  {inclHotel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: '#8A7D72' }}>🏨 Hospedaje ({Math.max(1, row.dias - 1)} noches)</span>
                      <span style={{ color: '#F5F0E8' }}>{fmt(calc.costHotel)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Extras */}
      {inclExtra && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.82rem', padding: '0 4px', color: '#8A7D72',
        }}>
          <span>🛠️ Imprevistos (10%)</span>
          <span style={{ color: '#F5F0E8' }}>{fmt(totalExtra)}</span>
        </div>
      )}

      {extraCosts > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.82rem', padding: '0 4px', color: '#8A7D72',
        }}>
          <span>➕ Gastos adicionales</span>
          <span style={{ color: '#F5F0E8' }}>{fmt(extraCosts)}</span>
        </div>
      )}

      {/* Total */}
      <div style={{
        background: '#E8580A', borderRadius: '10px',
        padding: '1.1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
            Coste Total Estimado
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
            {fmt(total / Math.max(1, totalDias))} / día · {totalDias} días
          </div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'white', letterSpacing: '1px' }}>
          {fmt(total)}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#8A7D72' }}>
        * Estimación orientativa. Los precios reales pueden variar.
      </p>
    </div>
  )
}