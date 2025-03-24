import { NextResponse } from "next/server"
import type { Customer } from "@/lib/db"

// GET /api/customers
export async function GET() {
  try {
    // Mock data
    const customers: Customer[] = [
      {
        id: "CUST001",
        name: "Acme Inc.",
        email: "contact@acme.com",
        phone: "(555) 123-4567",
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "United States",
        notes: "Important client",
        totalPurchases: 12500.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // More customers would be here
    ]

    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

// POST /api/customers
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to MongoDB
    const newCustomer: Customer = {
      id: "CUST" + Math.floor(1000 + Math.random() * 9000),
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country || "United States",
      notes: body.notes,
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ customer: newCustomer }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

