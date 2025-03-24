"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Plus,
  Trash2,
  CreditCard,
  Wallet,
  BanknoteIcon,
  ShoppingCart,
  User,
  ReceiptText,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock inventory data
const inventoryItems = [
  { id: "1", code: "ITM001", name: "Laptop Dell XPS 13", category: "Electronics", price: 1299.99, stock: 15 },
  { id: "2", code: "ITM002", name: "Wireless Mouse", category: "Accessories", price: 24.99, stock: 42 },
  { id: "3", code: "ITM003", name: "USB-C Cable", category: "Accessories", price: 12.99, stock: 78 },
  { id: "4", code: "ITM004", name: "External Hard Drive 1TB", category: "Storage", price: 89.99, stock: 8 },
  { id: "5", code: "ITM005", name: "Wireless Keyboard", category: "Accessories", price: 49.99, stock: 23 },
  { id: "6", code: "ITM006", name: '27" Monitor', category: "Electronics", price: 249.99, stock: 12 },
  { id: "7", code: "ITM007", name: "Bluetooth Headphones", category: "Audio", price: 79.99, stock: 35 },
  { id: "8", code: "ITM008", name: "Webcam HD", category: "Electronics", price: 59.99, stock: 18 },
  { id: "9", code: "ITM009", name: "Laptop Stand", category: "Accessories", price: 29.99, stock: 47 },
  { id: "10", code: "ITM010", name: "Smartphone Charger", category: "Accessories", price: 19.99, stock: 56 },
]

// Mock customer data
const customers = [
  { id: "CUST001", name: "John Smith", email: "john@example.com", phone: "(555) 123-4567" },
  { id: "CUST002", name: "Sarah Johnson", email: "sarah@example.com", phone: "(555) 234-5678" },
  { id: "CUST003", name: "Michael Brown", email: "michael@example.com", phone: "(555) 345-6789" },
  { id: "CUST004", name: "Emily Davis", email: "emily@example.com", phone: "(555) 456-7890" },
  { id: "CUST005", name: "David Wilson", email: "david@example.com", phone: "(555) 567-8901" },
]

interface CartItem {
  id: string
  code: string
  name: string
  price: number
  quantity: number
}

interface CustomerInfo {
  id: string
  name: string
  email: string
  phone: string
}

export default function BillingPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null)
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" })
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvc: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const receiptRef = useRef<HTMLDivElement>(null)
  const [receiptNumber, setReceiptNumber] = useState("")

  // Generate receipt number on component mount
  useEffect(() => {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000)
    setReceiptNumber(`REC-${timestamp.toString().slice(-6)}-${random}`)
  }, [])

  // Filter inventory items based on search term
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add item to cart
  const addToCart = (item: (typeof inventoryItems)[0]) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  // Update item quantity in cart
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  // Calculate tax (10%)
  const calculateTax = () => {
    return calculateSubtotal() * 0.1
  }

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (customer) {
      setSelectedCustomer(customer)
      setShowNewCustomerForm(false)
    }
  }

  // Handle new customer form submission
  const handleNewCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newCustomer.name || !newCustomer.email) {
      setError("Please provide at least a name and email for the new customer")
      return
    }

    // Create new customer (in a real app, this would be saved to the database)
    const newCustomerId = `CUST${Math.floor(1000 + Math.random() * 9000)}`
    const customerInfo = {
      id: newCustomerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
    }

    setSelectedCustomer(customerInfo)
    setShowNewCustomerForm(false)
    setNewCustomer({ name: "", email: "", phone: "" })
  }

  // Handle payment processing
  const handleProcessPayment = () => {
    // Validate cart
    if (cart.length === 0) {
      setError("Your cart is empty. Please add items before proceeding.")
      return
    }

    // Validate customer
    if (!selectedCustomer) {
      setError("Please select a customer or add a new one.")
      return
    }

    // Validate payment details for card payments
    if (paymentMethod === "card") {
      if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        setError("Please fill in all card details.")
        return
      }
    }

    setError(null)
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      // Create receipt data
      const receipt = {
        receiptNumber,
        date: new Date().toISOString(),
        customer: selectedCustomer,
        items: cart,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        paymentMethod,
      }

      setReceiptData(receipt)
      setLoading(false)
      setReceiptDialogOpen(true)

      // In a real app, you would:
      // 1. Update inventory quantities
      // 2. Save transaction to database
      // 3. Create customer record if new
    }, 1500)
  }

  // Handle printing receipt
  const handlePrintReceipt = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write("<html><head><title>Receipt</title>")
        printWindow.document.write("<style>")
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 80mm; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
          .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .totals { margin-top: 10px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .grand-total { font-weight: bold; font-size: 1.1em; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
        `)
        printWindow.document.write("</style></head><body>")
        printWindow.document.write(receiptRef.current.innerHTML)
        printWindow.document.write("</body></html>")
        printWindow.document.close()

        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.print()
          // printWindow.close() // Uncomment to auto-close after print dialog
        }
      }
    }
  }

  // Handle new transaction
  const handleNewTransaction = () => {
    setCart([])
    setSelectedCustomer(null)
    setPaymentMethod("card")
    setCardDetails({ name: "", number: "", expiry: "", cvc: "" })
    setReceiptDialogOpen(false)
    setReceiptData(null)

    // Generate new receipt number
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000)
    setReceiptNumber(`REC-${timestamp.toString().slice(-6)}-${random}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <ShoppingCart className="mr-2 h-6 w-6" />
        <h1 className="text-3xl font-bold">Billing System</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Product Selection
              </CardTitle>
              <CardDescription>Search and add products to the current bill</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products by name or code..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => addToCart(item)} disabled={item.stock <= 0}>
                              <Plus className="mr-1 h-4 w-4" />
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No products found. Try a different search term.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Current Cart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Current Cart
              </CardTitle>
              <CardDescription>Items in the current transaction</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.code}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                                className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-2 opacity-20" />
                  <p>Your cart is empty. Add products to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Billing Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ReceiptText className="mr-2 h-5 w-5" />
                Billing Information
              </CardTitle>
              <CardDescription>Customer and payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Customer</Label>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}>
                    {showNewCustomerForm ? "Select Existing" : "Add New"}
                  </Button>
                </div>

                {!showNewCustomerForm ? (
                  <Select onValueChange={handleCustomerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <form onSubmit={handleNewCustomerSubmit} className="space-y-3 border rounded-lg p-3">
                    <div className="space-y-1">
                      <Label htmlFor="customerName">Name</Label>
                      <Input
                        id="customerName"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      Add Customer
                    </Button>
                  </form>
                )}

                {selectedCustomer && (
                  <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{selectedCustomer.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.email} • {selectedCustomer.phone}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <Label className="text-base">Order Summary</Label>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="text-base">Payment Method</Label>

                <RadioGroup
                  defaultValue="card"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-3 gap-2"
                >
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-1 h-5 w-5" />
                      <span className="text-xs">Card</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                    <Label
                      htmlFor="wallet"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Wallet className="mb-1 h-5 w-5" />
                      <span className="text-xs">Wallet</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <BanknoteIcon className="mb-1 h-5 w-5" />
                      <span className="text-xs">Cash</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-3 mt-3 border rounded-lg p-3">
                    <div className="space-y-1">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleProcessPayment}
                disabled={loading || cart.length === 0 || !selectedCustomer}
              >
                {loading ? "Processing..." : `Complete Payment ($${calculateTotal().toFixed(2)})`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
            <DialogDescription>Your transaction has been completed successfully.</DialogDescription>
          </DialogHeader>

          {receiptData && (
            <div className="mt-4 border rounded-lg p-4 max-h-[60vh] overflow-y-auto">
              <div ref={receiptRef} className="receipt">
                <div className="header text-center">
                  <h2 className="text-xl font-bold">Inventory Billing App</h2>
                  <p className="text-sm text-muted-foreground">123 west Street, Tamil Nadu </p>
                  <p className="text-sm text-muted-foreground">Phone: 876543276</p>

                  <div className="mt-4">
                    <h3 className="font-bold">RECEIPT</h3>
                    <p className="text-sm">{receiptData.receiptNumber}</p>
                    <p className="text-sm">
                      {new Date(receiptData.date).toLocaleDateString()}{" "}
                      {new Date(receiptData.date).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="mt-2 text-left">
                    <p className="text-sm">
                      <span className="font-semibold">Customer:</span> {receiptData.customer.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Phone:</span> {receiptData.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="divider my-3 border-t border-dashed"></div>

                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Item</th>
                        <th className="text-center py-1">Qty</th>
                        <th className="text-right py-1">Price</th>
                        <th className="text-right py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.items.map((item: CartItem) => (
                        <tr key={item.id} className="border-b border-dotted">
                          <td className="py-1">{item.name}</td>
                          <td className="text-center py-1">{item.quantity}</td>
                          <td className="text-right py-1">${item.price.toFixed(2)}</td>
                          <td className="text-right py-1">${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divider my-3 border-t border-dashed"></div>

                <div className="totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${receiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax (10%):</span>
                    <span>${receiptData.tax.toFixed(2)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>TOTAL:</span>
                    <span>${receiptData.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-semibold">Payment Method:</span>{" "}
                      {receiptData.paymentMethod === "card"
                        ? "Credit Card"
                        : receiptData.paymentMethod === "wallet"
                          ? "Digital Wallet"
                          : "Cash"}
                    </p>
                  </div>
                </div>

                <div className="divider my-3 border-t border-dashed"></div>

                <div className="footer">
                  <p className="text-sm">Thank you for your purchase!</p>
                  <p className="text-xs mt-1">Keep this receipt for your records</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePrintReceipt} className="sm:flex-1">
              Print Receipt
            </Button>
            <Button onClick={handleNewTransaction} className="sm:flex-1">
              New Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

