'use client'

import { useState } from 'react'
import { COUNTRIES_SOUTH_AMERICA } from '@/lib/countries'
import WaitlistModal from '@/components/WaitlistModal'

interface Country {
  code: string
  name: string
  capital: string
}

interface Props {
  value: Country[]
  onChange: (countries: Country[]) => void
}

const INITIAL_COUNT = 6

export default function CountrySelector({ value, onChange }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function toggleCountry(country: Country) {
    const exists = value.find(c => c.code === country.code)
    if (exists) {
      onChange(value.filter(c => c.code !== country.code))
    } else {
      onChange([...value, country])
    }
  }

  const isSelected = (code: string) => !!value.find(c => c.code === code)
  const visible = showAll ? COUNTRIES_SOUTH_AMERICA : COUNTRIES_SOUTH_AMERICA.slice(0, INITIAL_COUNT)
  const remaining = COUNTRIES_SOUTH_AMERICA.length - INITIAL_COUNT

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {visible.map(country => {
          const selected = isSelected(country.code)
          return (
            <button
              key={country.code}
              onClick={() => toggleCountry(country)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: selected ? '1px solid #E8580A' : '1px solid rgba(255,255,255,0.1)',
                background: selected ? 'rgba(232,88,10,0.15)' : 'rgba(255,255,255,0.03)',
                color: selected ? '#F5F0E8' : '#8A7D72',
                fontSize: '0.82rem',
                fontWeight: selected ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <img
                src={`https://flagcdn.com/20x15/${country.code.toLowerCase()}.png`}
                alt={country.name}
                style={{ width: '16px', height: '12px', borderRadius: '2px' }}
              />
              {country.name}
            </button>
          )
        })}
      </div>

      {!showAll && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: '1px solid rgba(232,88,10,0.4)',
            borderRadius: '6px',
            color: '#E8580A',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '5px 12px',
          }}
        >
          Ver más países →
        </button>
        
      )}

      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}

    </div>
  )
}