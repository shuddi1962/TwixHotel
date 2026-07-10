import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function AdminPlansPage() {
  const supabase = await createAdminClient()
  const { data: plans } = await supabase.from("plans").select("*").order("price")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Subscription Plans</h1>
          <p className="text-sm text-muted mt-1">Manage pricing plans for hotels</p>
        </div>
        <Button><Plus className="w-4 h-4" /> Add Plan</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(plans || []).map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>${Number(plan.price).toFixed(2)}</TableCell>
                  <TableCell>{plan.validity} months</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === 1 ? "success" : "danger"}>
                      {plan.status === 1 ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!plans || plans.length === 0) && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted">No plans defined yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
