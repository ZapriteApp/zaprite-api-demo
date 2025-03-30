import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const getZapriteApiUrl = () => {
  const apiUrl = process.env.ZAPRITE_API_URL
  if (!apiUrl) {
    throw new Error('ZAPRITE_API_URL environment variable is not set')
  }
  return apiUrl
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const zapriteApiUrl = getZapriteApiUrl()

    const response = await fetch(`${zapriteApiUrl}/v1/order/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.ZAPRITE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch order from Zaprite')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 },
    )
  }
}
