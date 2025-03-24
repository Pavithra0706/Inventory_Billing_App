"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react"

interface ReceiptItem {
  id: number
  description: string
  quantity: number
  price: number
}

interface ReceiptData {
  invoiceNumber: string
  customer: string
  paymentMethod: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  date: string
}

export default function ReceiptPage() {
  const searchParams = useSearchParams()
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const encodedData = searchParams.get("data")
      if (encodedData) {
        const decodedData = JSON.parse(decodeURIComponent(encodedData))
        setReceiptData(decodedData)
      }
    } catch (error) {
      console.error("Error parsing receipt data:", error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading receipt...</div>
  }

  if (!receiptData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
        <p className="mb-6">The receipt data could not be loaded.</p>
        <Link href="/invoices">
          <Button>Return to Invoices</Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(receiptData.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link href="/invoices" className="flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto border-2">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">RECEIPT</h1>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
            <div className="text-right">
              <CardTitle>Your Company Name</CardTitle>
              <CardDescription>123 Business Street</CardDescription>
              <CardDescription>City, State 12345</CardDescription>
              <CardDescription>contact@yourcompany.com</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">BILLED TO</h3>
              <p className="font-medium">{receiptData.customer}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">RECEIPT NUMBER</h3>
              <p className="font-medium">{receiptData.invoiceNumber}</p>
              <h3 className="font-semibold text-sm text-muted-foreground mt-2 mb-1">PAYMENT METHOD</h3>
              <p className="font-medium capitalize">{receiptData.paymentMethod}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">PURCHASED ITEMS</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receiptData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="flex w-full max-w-[240px] justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex w-full max-w-[240px] justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span>${receiptData.tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2 w-full max-w-[240px]" />
            <div className="flex w-full max-w-[240px] justify-between font-bold">
              <span>Total:</span>
              <span>${receiptData.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col border-t pt-6">
          <div className="text-center w-full">
            <p className="text-muted-foreground mb-2">Thank you for your business!</p>
            <p className="text-xs text-muted-foreground">
              This receipt was generated automatically and is valid without a signature.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

