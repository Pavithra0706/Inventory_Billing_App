import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Search } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          <h1 className="text-3xl font-bold">Invoices</h1>
        </div>
        <Link href="/invoices/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search invoices..." className="pl-8" />
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
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {invoice.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/invoices/${invoice.id}`}>
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

const invoices = [
  {
    id: "1",
    number: "INV-001",
    customer: "Acme Inc.",
    date: "2023-03-15",
    dueDate: "2023-04-15",
    amount: 1250.0,
    status: "Paid",
  },
  {
    id: "2",
    number: "INV-002",
    customer: "Globex Corp",
    date: "2023-03-18",
    dueDate: "2023-04-18",
    amount: 3450.75,
    status: "Pending",
  },
  {
    id: "3",
    number: "INV-003",
    customer: "Wayne Enterprises",
    date: "2023-03-20",
    dueDate: "2023-04-20",
    amount: 789.5,
    status: "Paid",
  },
  {
    id: "4",
    number: "INV-004",
    customer: "Stark Industries",
    date: "2023-03-25",
    dueDate: "2023-04-25",
    amount: 4500.0,
    status: "Overdue",
  },
  {
    id: "5",
    number: "INV-005",
    customer: "Daily Planet",
    date: "2023-03-28",
    dueDate: "2023-04-28",
    amount: 1200.0,
    status: "Pending",
  },
]

