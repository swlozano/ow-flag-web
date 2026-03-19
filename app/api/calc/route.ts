import { NextRequest, NextResponse } from 'next/server'

async function getCoordinates(place: string): Promise<[number, number] | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(place)}&limit=1&language=es&access_token=${token}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.features?.length) return null
  return data.features[0].geometry.coordinates
}

async function getDistanciaReal(origen: string, destino: string): Promise<number | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const coordOrigen = await getCoordinates(origen)
  const coordDestino = await getCoordinates(destino)
  if (!coordOrigen || !coordDestino) return null

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordOrigen[0]},${coordOrigen[1]};${coordDestino[0]},${coordDestino[1]}?access_token=${token}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.routes?.length) return null

  return Math.round(data.routes[0].distance / 1000)
}

export async function POST(req: NextRequest) {
  const { origen, destino, cilindrada, dias, inclPeaje, inclComida, inclHotel, inclExtra } = await req.json()

  const distanciaReal = await getDistanciaReal(origen, destino)

  const prompt = `
Eres un experto en viajes en moto. El usuario quiere viajar en moto y necesitas calcular el coste estimado del viaje con estos datos:

- Origen: ${origen}
- Destino: ${destino}
- Distancia real por carretera: ${distanciaReal ? `${distanciaReal} km (dato exacto, úsalo tal cual)` : 'calcula tú la distancia estimada'}
- Cilindrada de la moto: ${cilindrada} cc
- País/región de origen: ${origen}
- Días de viaje: ${dias}
- Incluir peajes: ${inclPeaje ? 'Sí' : 'No'}
- Incluir comida: ${inclComida ? 'Sí' : 'No'}
- Incluir hospedaje: ${inclHotel ? 'Sí' : 'No'}
- Incluir imprevistos (10%): ${inclExtra ? 'Sí' : 'No'}

Calcula los costes basándote en:
- Usa la distancia real proporcionada, NO la modifiques
- Consumo según cilindrada: 125cc=4.5L/100km, 300cc=5.5L/100km, 600cc=6.5L/100km, 1000cc=8L/100km, 1200cc=9.5L/100km
- Usa el precio actual real de la gasolina en el país de origen en USD/L
- Peajes reales estimados de esa ruta en USD
- Comida: $35/día
- Hospedaje: $70/noche
- Imprevistos: 10% del subtotal si aplica
- Devuelve todos los costes en dólares americanos (USD)

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin bloques de código:
{
  "distancia": número en km,
  "litros": número con 1 decimal,
  "precioGas": número con 2 decimales,
  "costeFuel": número con 2 decimales,
  "costePeaje": número con 2 decimales,
  "costeComida": número con 2 decimales,
  "costeHotel": número con 2 decimales,
  "costeExtra": número con 2 decimales,
  "total": número con 2 decimales,
  "consejo": "un consejo útil y específico para esta ruta en moto"
}
`

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    const data = await res.json()
    const text = data.choices[0].message.content.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const resultado = JSON.parse(clean)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('OpenRouter error:', error)
    return NextResponse.json({ error: 'Error al calcular la ruta' }, { status: 500 })
  }
}