import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminFrontendPage() {
  const supabase = await createAdminClient()
  const { data: frontends } = await supabase.from("frontends").select("*").limit(20)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Frontend Manager</h1><p className="text-sm text-muted mt-1">Manage landing page content and sections</p></div>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Key</TableHead><TableHead>Template</TableHead><TableHead>Slug</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(frontends || []).map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.data_keys}</TableCell>
                <TableCell>{f.tempname || "—"}</TableCell>
                <TableCell className="text-muted">{f.slug || "—"}</TableCell>
                <TableCell><Button variant="secondary" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
