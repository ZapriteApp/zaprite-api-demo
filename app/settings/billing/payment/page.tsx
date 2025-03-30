'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

interface ZapriteOrder {
  id: string
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'PAID'
    | 'OVERPAID'
    | 'UNDERPAID'
    | 'COMPLETE'
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>(
    'loading',
  )
  const [order, setOrder] = useState<ZapriteOrder | null>(null)

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Get cart_id from URL params or localStorage
        const cartId =
          searchParams.get('cart_id') || localStorage.getItem('cart_id')

        if (!cartId) {
          toast.error('No payment found.')
          setStatus('error')
          return
        }

        // Make API call to Zaprite
        const response = await fetch(`/api/billing/order/${cartId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch order status')
        }

        const data: ZapriteOrder = await response.json()
        setOrder(data)

        // Determine status based on order state
        if (data.status === 'COMPLETE' || data.status === 'PAID') {
          setStatus('success')
        } else if (data.status === 'UNDERPAID') {
          setStatus('error')
        } else {
          setStatus('loading')
        }
      } catch (error) {
        console.error('Error fetching order status:', error)
        setStatus('error')
        toast.error('Failed to fetch payment status')
      }
    }

    fetchOrderStatus()
  }, [searchParams])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings/billing">
                    Billing
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Payment</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Payment Result</CardTitle>
              <CardDescription>
                {status === 'success'
                  ? 'Your payment has been processed successfully.'
                  : status === 'error'
                    ? 'There was an error processing your payment.'
                    : 'Processing payment result...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                {status === 'success' ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : status === 'error' ? (
                  <XCircle className="h-16 w-16 text-red-500" />
                ) : null}
                {order && (
                  <pre className="mt-4 w-full overflow-auto rounded-lg bg-muted p-4 text-sm">
                    {JSON.stringify(order, null, 2)}
                  </pre>
                )}
                <Button
                  onClick={() => (window.location.href = '/settings/billing')}
                  className="mt-4"
                >
                  Return to Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
