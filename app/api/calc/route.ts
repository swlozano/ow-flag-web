import { NextRequest, NextResponse } from 'next/server'
import { FUEL_PRICES_USD } from '@/lib/fuelPrices'
import { ACCOMMODATION_PRICES } from '@/lib/accommodationPrices'
import { FOOD_PRICES } from '@/lib/foodPrices'

interface Country {
  code: string
  name: string
  capital: string
}

const CONSUMPTION: Record<string, number> = {
  '125': 4.5,
  '300': 5.5,
  '600': 6.5,
  '1000': 8.0,
  '1200': 9.5,
}

export async function POST(req: NextRequest) {
  const { countries, cilindrada, tripStyle } = await req.json()

  const consumption = CONSUMPTION[cilindrada] ?? 6.5

  const countryData = countries.map((country: Country) => {
    const fuelPrice = FUEL_PRICES_USD[country.code] ?? 1.0
    const accommodationPrices = ACCOMMODATION_PRICES[country.code]
    const foodPrices = FOOD_PRICES[country.code]

    return {
      code: country.code,
      name: country.name,
      fuelPrice,
      foodPricePerDay: foodPrices ? foodPrices[tripStyle as keyof typeof foodPrices] : 25,
      hotelPricePerNight: accommodationPrices ? accommodationPrices[tripStyle as keyof typeof accommodationPrices] : 50,
      consumption,
    }
  })

  return NextResponse.json({ countryData })
}