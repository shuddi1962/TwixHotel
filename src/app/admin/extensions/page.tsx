import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminExtensionsPage() {
  const supabase = await createAdminClient()
  const { data: extensions } = await supabase.from("extensions").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Extensions</h1>
        <p className="text-sm text-muted mt-1">Manage plugins and third-party integrations</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Identifier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(extensions || []).map((ext) => (
                <TableRow key={ext.id}>
                  <TableCell className="font-medium">{ext.name}</TableCell>
                  <TableCell className="font-mono text-xs">{ext.act}</TableCell>
                  <TableCell>
                    <Badge variant={ext.status === 1 ? "success" : "danger"}>
                      {ext.status === 1 ? "Active" : "Disabled"}
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
