'use client'

import { useState, useEffect } from 'react'
import RouteForm from '@/components/RouteForm'
import CostBreakdown from '@/components/CostBreakdown'
import { ResultadoCalculo } from '@/lib/calculos'

export default function Home() {
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [dias, setDias] = useState(3)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 820)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleResult(res: ResultadoCalculo, org: string, dst: string, d: number) {
    setOrigen(org)
    setDestino(dst)
    setDias(d)
    setResultado(res)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#1A1612' }}>

      {/* Header */}
      <header style={{ position: 'relative', textAlign: 'center', padding: '2.5rem 2rem 0', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,88,10,0.18) 0%, transparent 70%)',
        }} />
        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '6px', color: '#E8580A', marginBottom: '0.5rem' }}>
          RUTAMOTO
        </p>
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          lineHeight: 0.92, letterSpacing: '2px',
          color: '#F5F0E8', marginBottom: '0.5rem',
        }}>
          CALCULA TU
          <span style={{ color: '#E8580A', display: 'block' }}>AVENTURA</span>
        </h1>
        <p style={{ color: '#8A7D72', fontSize: '0.9rem', letterSpacing: '0.5px', marginBottom: '2.5rem' }}>
          Gasolina · Peajes · Comida · Hospedaje
        </p>
        <div className="road" />
      </header>

      {/* Main grid */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem 4rem',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 420px',
        gap: '2rem',
        alignItems: 'start',
      }}>
        <RouteForm onResult={handleResult} />

        <div style={{ position: isMobile ? 'static' : 'sticky', top: '1.5rem' }}>
          {resultado ? (
            <CostBreakdown
              resultado={resultado}
              origen={origen}
              destino={destino}
              dias={dias}
            />
          ) : (
            <div style={{
              background: '#2A2219',
              border: '1px solid rgba(232,88,10,0.2)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '1rem',
              minHeight: '300px',
            }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity={0.2}>
                <circle cx="40" cy="40" r="38" stroke="#E8580A" strokeWidth="1.5" strokeDasharray="6 4"/>
                <path d="M18 54c6-12 10-16 22-16s16 4 22 16" stroke="#E8580A" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="54" r="6" stroke="#E8580A" strokeWidth="2"/>
                <circle cx="56" cy="54" r="6" stroke="#E8580A" strokeWidth="2"/>
                <path d="M34 38l6-9 9 9h5l-4-9" stroke="#E8580A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ color: '#8A7D72', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Introduce tu ruta y configura tu moto para obtener una estimación del coste total del viaje.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer style={{ textAlign: 'center', paddingBottom: '2rem', fontSize: '0.75rem', color: '#8A7D72' }}>
        Hecho con ❤️ para <span style={{ color: '#E8580A' }}>moteros</span> · RutaMoto 2025
      </footer>
    </main>
  )
}