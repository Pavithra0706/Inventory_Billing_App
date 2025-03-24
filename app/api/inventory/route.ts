import { NextResponse } from "next/server"
import type { InventoryItem } from "@/lib/db"

// In a real application, this would connect to MongoDB
// For now, we'll use a mock implementation

// GET /api/inventory
export async function GET() {
  try {
    // Mock data
    const items: InventoryItem[] = [
      {
        id: "1",
        code: "ITM001",
        name: "Laptop Dell XPS 13",
        category: "Electronics",
        description: "13-inch laptop with Intel Core i7",
        price: 1299.99,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // More items would be here
    ]

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 })
  }
}

// POST /api/inventory
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.code || !body.name || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to MongoDB
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substring(7),
      code: body.code,
      name: body.name,
      category: body.category || "Other",
      description: body.description,
      price: Number.parseFloat(body.price),
      stock: Number.parseInt(body.stock) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
  }
}

