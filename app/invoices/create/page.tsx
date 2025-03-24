"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Plus, Trash2, CreditCard, Wallet, BanknoteIcon } from "lucide-react"

export default function CreateInvoice() {
  const router = useRouter()
  const [items, setItems] = useState([{ id: 1, description: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 }])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [customer, setCustomer] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("INV-006")

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: newId, description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)

      // Navigate to receipt page with invoice data
      const receiptData = {
        invoiceNumber,
        customer,
        paymentMethod,
        items,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        date: new Date().toISOString(),
      }

      // In a real app, you would save this data to the database first
      // For now, we'll pass it through the URL (not ideal for production)
      const encodedData = encodeURIComponent(JSON.stringify(receiptData))
      router.push(`/invoices/receipt?data=${encodedData}`)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/invoices" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Invoices
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>Create a new invoice for your customer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select onValueChange={setCustomer} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acme Inc.">Acme Inc.</SelectItem>
                        <SelectItem value="Globex Corp">Globex Corp</SelectItem>
                        <SelectItem value="Wayne Enterprises">Wayne Enterprises</SelectItem>
                        <SelectItem value="Stark Industries">Stark Industries</SelectItem>
                        <SelectItem value="Daily Planet">Daily Planet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" required />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Invoice Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px]">Quantity</TableHead>
                          <TableHead className="w-[150px]">Price</TableHead>
                          <TableHead className="text-right w-[150px]">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                placeholder="Item description"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value))}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value))}
                                required
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                disabled={items.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    defaultValue="card"
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-3 gap-4 pt-2"
                  >
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                      <Label
                        htmlFor="wallet"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Wallet className="mb-3 h-6 w-6" />
                        Wallet
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                      <Label
                        htmlFor="cash"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <BanknoteIcon className="mb-3 h-6 w-6" />
                        Cash
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required={paymentMethod === "card"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required={paymentMethod === "card"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required={paymentMethod === "card"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required={paymentMethod === "card"} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Add any notes or payment instructions..."
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Processing Payment..." : "Complete Payment"}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Save as Draft
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

