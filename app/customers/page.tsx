import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="mr-2 h-6 w-6" />
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <Link href="/customers/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search customers..." className="pl-8" />
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Purchases</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>${customer.totalPurchases.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm">
                      View
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

const customers = [
  {
    id: "CUST001",
    name: "Acme Inc.",
    email: "contact@acme.com",
    phone: "(555) 123-4567",
    totalPurchases: 12500.0,
  },
  {
    id: "CUST002",
    name: "Globex Corp",
    email: "info@globex.com",
    phone: "(555) 234-5678",
    totalPurchases: 8750.5,
  },
  {
    id: "CUST003",
    name: "Wayne Enterprises",
    email: "orders@wayne.com",
    phone: "(555) 345-6789",
    totalPurchases: 15200.75,
  },
  {
    id: "CUST004",
    name: "Stark Industries",
    email: "sales@stark.com",
    phone: "(555) 456-7890",
    totalPurchases: 9300.25,
  },
  {
    id: "CUST005",
    name: "Daily Planet",
    email: "business@dailyplanet.com",
    phone: "(555) 567-8901",
    totalPurchases: 4800.0,
  },
]

