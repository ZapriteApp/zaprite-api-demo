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
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function createZapriteOrder() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/billing/create-order', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Error creating order:', error)
      setIsLoading(false)
      toast.error('Could not create Order')
    }
  }

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
                  <BreadcrumbPage>Billing</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your current subscription plan and billing status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Monthly billing
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$29/month</p>
                    <p className="text-sm text-muted-foreground">
                      Next billing date: May 1, 2025
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <span className="text-sm font-medium text-orange-400">
                      Expiring
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Method</span>
                    <span className="text-sm font-medium">•••• 4242</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and payment history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">April 2025</p>
                      <p className="text-sm text-muted-foreground">
                        Invoice #INV-2025-003
                      </p>
                    </div>
                    <div className="ml-auto mr-6">
                      <Button onClick={createZapriteOrder} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-orange-400">
                        Due on Apr 1, 2025
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">March 2025</p>
                      <p className="text-sm text-muted-foreground">
                        Invoice #INV-2025-002
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-muted-foreground">
                        Paid on Mar 1, 2025
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">February 2025</p>
                      <p className="text-sm text-muted-foreground">
                        Invoice #INV-2025-001
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-muted-foreground">
                        Paid on Feb 1, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
