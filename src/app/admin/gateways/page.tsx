import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminGatewaysPage() {
  const supabase = await createAdminClient()
  const { data: gateways } = await supabase.from("gateways").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Payment Gateways</h1>
          <p className="text-sm text-muted mt-1">Manage payment gateway integrations</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gateway</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(gateways || []).map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="font-mono text-xs">{g.code}</TableCell>
                  <TableCell>
                    <Badge variant={g.crypto === 1 ? "warning" : "info"}>
                      {g.crypto === 1 ? "Crypto" : "Fiat"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={g.status === 1 ? "success" : "danger"}>
                      {g.status === 1 ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell><Button variant="secondary" size="sm">Configure</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
