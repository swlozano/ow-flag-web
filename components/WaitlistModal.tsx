'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onClose: () => void
}

export default function WaitlistModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email.trim() || !email.includes('@')) {
      setError('Introduce un email válido.')
      return
    }

    setLoading(true)
    setError('')

    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({ email: email.trim().toLowerCase() })

    setLoading(false)

    if (dbError) {
      if (dbError.code === '23505') {
        setError('Este email ya está registrado.')
      } else {
        setError('Error al guardar. Intenta de nuevo.')
      }
      return
    }

    setSuccess(true)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#2A2219',
          border: '1px solid rgba(232,88,10,0.3)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {!success ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.8rem', letterSpacing: '2px',
                color: '#F5F0E8', marginBottom: '0.5rem',
              }}>
                Más países <span style={{ color: '#E8580A' }}>próximamente</span>
              </p>
              <p style={{ fontSize: '0.88rem', color: '#8A7D72', lineHeight: 1.6 }}>
                Estamos trabajando para añadir más países y funciones. Déjanos tu email y te avisamos cuando esté listo.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%', height: '46px', padding: '0 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#F5F0E8',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
                  outline: 'none',
                }}
              />

              {error && (
                <p style={{ fontSize: '0.82rem', color: '#f97070' }}>⚠️ {error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', height: '48px',
                  background: loading ? '#8A7D72' : '#E8580A',
                  border: 'none', borderRadius: '8px', color: 'white',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'GUARDANDO...' : 'AVISAME CUANDO ESTÉ LISTO'}
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '100%', height: '40px',
                  background: 'none', border: 'none',
                  color: '#8A7D72', fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                No, gracias
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏍️</div>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.8rem', letterSpacing: '2px',
              color: '#F5F0E8', marginBottom: '0.5rem',
            }}>
              ¡Listo!
            </p>
            <p style={{ fontSize: '0.88rem', color: '#8A7D72', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Te avisaremos cuando tengamos más países disponibles.
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%', height: '48px',
                background: '#E8580A',
                border: 'none', borderRadius: '8px', color: 'white',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                letterSpacing: '2px', cursor: 'pointer',
              }}
            >
              CERRAR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}