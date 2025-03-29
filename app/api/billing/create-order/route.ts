import { NextResponse } from 'next/server'

const getZapriteApiUrl = () => {
  const apiUrl = process.env.ZAPRITE_API_URL
  if (!apiUrl) {
    throw new Error('ZAPRITE_API_URL environment variable is not set')
  }
  return apiUrl
}

export async function POST() {
  try {
    const zapriteApiUrl = getZapriteApiUrl()
    const response = await fetch(`${zapriteApiUrl}/v1/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZAPRITE_API_KEY}`,
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'USD',
        label: 'Acme Inc Billing Order',
        customCheckoutId: 'cm8uluauv000i13jim8z0f82e',
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing/payment`,
        sendReceiptToCustomer: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Error connecting to Checkout.')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    )
  }
}
