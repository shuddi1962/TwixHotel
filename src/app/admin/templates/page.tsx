import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default async function AdminTemplatesPage() {
  const supabase = await createAdminClient()
  const { data: templates } = await supabase.from("templates").select("*")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Templates</h1><p className="text-sm text-muted mt-1">Hotel website templates</p></div>
        <Button><Plus className="w-4 h-4" /> Add Template</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Demo URL</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(templates || []).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-primary text-sm">{t.demo_url || "—"}</TableCell>
                <TableCell><Button variant="secondary" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
