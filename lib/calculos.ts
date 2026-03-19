export const CONSUMOS: Record<string, number> = {
  '125': 4.5,
  '300': 5.5,
  '600': 6.5,
  '1000': 8.0,
  '1200': 9.5,
}

export const DISTANCIAS: Record<string, number> = {
  'madrid-barcelona': 630, 'barcelona-madrid': 630,
  'madrid-valencia': 360, 'valencia-madrid': 360,
  'madrid-sevilla': 530, 'sevilla-madrid': 530,
  'madrid-bilbao': 400, 'bilbao-madrid': 400,
  'madrid-malaga': 540, 'malaga-madrid': 540,
  'barcelona-valencia': 350, 'valencia-barcelona': 350,
  'barcelona-bilbao': 620, 'bilbao-barcelona': 620,
  'madrid-zaragoza': 325, 'zaragoza-madrid': 325,
  'madrid-granada': 435, 'granada-madrid': 435,
  'madrid-alicante': 420, 'alicante-madrid': 420,
  'madrid-oviedo': 450, 'oviedo-madrid': 450,
  'madrid-santiago': 640, 'santiago-madrid': 640,
  'madrid-pamplona': 400, 'pamplona-madrid': 400,
  'paris-madrid': 1270, 'madrid-paris': 1270,
  'paris-barcelona': 1040, 'barcelona-paris': 1040,
  'madrid-lisboa': 625, 'lisboa-madrid': 625,
  'madrid-murcia': 400, 'murcia-madrid': 400,
}

export const PEAJES: Record<string, number> = {
  'madrid-barcelona': 35, 'barcelona-madrid': 35,
  'madrid-zaragoza': 20, 'zaragoza-madrid': 20,
  'barcelona-valencia': 18, 'valencia-barcelona': 18,
  'madrid-bilbao': 22, 'bilbao-madrid': 22,
  'paris-madrid': 60, 'madrid-paris': 60,
  'paris-barcelona': 55, 'barcelona-paris': 55,
  'madrid-lisboa': 30, 'lisboa-madrid': 30,
}

export const CONSEJOS = [
  'Llenar el depósito en gasolineras de carretera secundaria suele ser más barato.',
  'Los albergues para moteros son una alternativa económica al hotel, desde 25 €/noche.',
  'Revisa la presión de los neumáticos antes de salir: el consumo puede bajar un 5%.',
  'Los bonos de autopista para motos ofrecen descuentos de hasta el 20% en peajes.',
  'Viajar en días laborables reduce el coste del hospedaje hasta un 30%.',
]

export function normalizar(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

export function getDistancia(origen: string, destino: string): number {
  const key = normalizar(origen) + '-' + normalizar(destino)
  if (DISTANCIAS[key]) return DISTANCIAS[key]
  const seed = (origen + destino).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return 200 + (seed % 800)
}

export function getPeaje(origen: string, destino: string): number {
  const key = normalizar(origen) + '-' + normalizar(destino)
  if (PEAJES[key]) return PEAJES[key]
  return Math.round(getDistancia(origen, destino) * 0.04)
}

export interface ResultadoCalculo {
  distancia: number
  litros: number
  costeFuel: number
  costePeaje: number
  costeComida: number
  costeHotel: number
  costeExtra: number
  total: number
  consejo: string
}

export function calcularCoste(params: {
  origen: string
  destino: string
  cilindrada: string
  precioGas: number
  dias: number
  inclPeaje: boolean
  inclComida: boolean
  inclHotel: boolean
  inclExtra: boolean
}): ResultadoCalculo {
  const { origen, destino, cilindrada, precioGas, dias, inclPeaje, inclComida, inclHotel, inclExtra } = params

  const consumo = CONSUMOS[cilindrada]
  const distancia = getDistancia(origen, destino)
  const litros = (distancia / 100) * consumo
  const costeFuel = litros * precioGas
  const costePeaje = inclPeaje ? getPeaje(origen, destino) : 0
  const costeComida = inclComida ? 35 * dias : 0
  const noches = Math.max(1, dias - 1)
  const costeHotel = inclHotel ? 70 * noches : 0
  const subtotal = costeFuel + costePeaje + costeComida + costeHotel
  const costeExtra = inclExtra ? subtotal * 0.10 : 0
  const total = subtotal + costeExtra
  const consejo = CONSEJOS[Math.floor(Math.random() * CONSEJOS.length)]

  return { distancia, litros, costeFuel, costePeaje, costeComida, costeHotel, costeExtra, total, consejo }
}