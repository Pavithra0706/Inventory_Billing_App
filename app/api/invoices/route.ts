import { NextResponse } from "next/server"
import type { Invoice, InvoiceItem } from "@/lib/db"

// GET /api/invoices
export async function GET() {
  try {
    // Mock data
    const invoices: Invoice[] = [
      {
        id: "1",
        number: "INV-001",
        customerId: "CUST001",
        date: new Date("2023-03-15"),
        dueDate: new Date("2023-04-15"),
        subtotal: 1136.36,
        tax: 113.64,
        total: 1250.0,
        notes: "Net 30 payment terms",
        status: "Paid",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // More invoices would be here
    ]

    return NextResponse.json({ invoices })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

// POST /api/invoices
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.number || !body.customerId || !body.items || !body.items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + Number.parseFloat(item.price) * Number.parseInt(item.quantity),
      0,
    )
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    // In a real app, this would save to MongoDB
    const newInvoice: Invoice = {
      id: Math.random().toString(36).substring(7),
      number: body.number,
      customerId: body.customerId,
      date: new Date(body.date),
      dueDate: new Date(body.dueDate),
      subtotal,
      tax,
      total,
      notes: body.notes,
      status: body.status || "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Create invoice items
    const invoiceItems: InvoiceItem[] = body.items.map((item: any) => ({
      id: Math.random().toString(36).substring(7),
      invoiceId: newInvoice.id,
      itemId: item.itemId || "",
      description: item.description,
      quantity: Number.parseInt(item.quantity),
      price: Number.parseFloat(item.price),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    return NextResponse.json(
      {
        invoice: newInvoice,
        items: invoiceItems,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

