import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="mr-2 h-6 w-6" />
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>
        <Link href="/inventory/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search inventory..." className="pl-8" />
        </div>
        <Button variant="outline" className="ml-2">
          Filter
        </Button>
        <Button variant="outline" className="ml-2">
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.stock}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.stock > 10
                        ? "bg-green-100 text-green-800"
                        : item.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.stock > 10 ? "In Stock" : item.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/inventory/edit/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const inventoryItems = [
  {
    id: "1",
    code: "ITM001",
    name: "Laptop Dell XPS 13",
    category: "Electronics",
    price: 1299.99,
    stock: 15,
  },
  {
    id: "2",
    code: "ITM002",
    name: "Wireless Mouse",
    category: "Accessories",
    price: 24.99,
    stock: 42,
  },
  {
    id: "3",
    code: "ITM003",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
    stock: 78,
  },
  {
    id: "4",
    code: "ITM004",
    name: "External Hard Drive 1TB",
    category: "Storage",
    price: 89.99,
    stock: 8,
  },
  {
    id: "5",
    code: "ITM005",
    name: "Wireless Keyboard",
    category: "Accessories",
    price: 49.99,
    stock: 0,
  },
]

