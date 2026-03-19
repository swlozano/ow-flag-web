'use client'

import { useState, useRef, useEffect } from 'react'

interface Suggestion {
  mapbox_id: string
  name: string
  place_formatted: string
}

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function CityAutocomplete({ placeholder, value, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [sessionToken] = useState(() => crypto.randomUUID())
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function fetchSuggestions(query: string) {
    if (query.length < 2) { setSuggestions([]); setOpen(false); return }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&language=es&types=city,region&limit=5&session_token=${sessionToken}&access_token=${token}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setOpen(true)
    } catch {
      setSuggestions([])
    }
  }

  function handleSelect(s: Suggestion) {
    onChange(s.name)
    setSuggestions([])
    setOpen(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '46px', padding: '0 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: open && suggestions.length > 0 ? '8px 8px 0 0' : '8px',
    color: '#F5F0E8',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => { onChange(e.target.value); fetchSuggestions(e.target.value) }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        style={inputStyle}
      />
      {open && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#2A2219',
          border: '1px solid rgba(232,88,10,0.3)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          listStyle: 'none', margin: 0, padding: 0,
          zIndex: 100,
          overflow: 'hidden',
        }}>
          {suggestions.map(s => (
            <li
              key={s.mapbox_id}
              onMouseDown={() => handleSelect(s)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,88,10,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontSize: '0.9rem', color: '#F5F0E8', fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#8A7D72', marginTop: '2px' }}>{s.place_formatted}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}