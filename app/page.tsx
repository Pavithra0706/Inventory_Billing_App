import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, FileText, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-primary">Inventory Billing System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <Package className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247 items</div>
            <p className="text-xs text-blue-100">12 items low in stock</p>
          </CardContent>
          <CardFooter>
            <Link href="/inventory" className="w-full">
              <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                Manage Inventory
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54 customers</div>
            <p className="text-xs text-green-100">↗︎ 6 new this month</p>
          </CardContent>
          <CardFooter>
            <Link href="/customers" className="w-full">
              <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                Manage Customers
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128 invoices</div>
            <p className="text-xs text-purple-100">↗︎ 18 generated this month</p>
          </CardContent>
          <CardFooter>
            <Link href="/invoices" className="w-full">
              <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                Manage Invoices
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-orange-100">↗︎ 4% from last month</p>
          </CardContent>
          <CardFooter>
            <Link href="/reports" className="w-full">
              <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                View Reports
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-primary">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/inventory/add">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Add New Item</Button>
          </Link>
          <Link href="/invoices/create">
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">Create Invoice</Button>
          </Link>
          <Link href="/customers/add">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Add Customer</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

