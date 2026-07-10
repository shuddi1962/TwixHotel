import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminTicketsPage() {
  const supabase = await createAdminClient()
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Support Tickets</h1>
        <p className="text-sm text-muted mt-1">Manage user support requests</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Reply</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tickets || []).map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">{ticket.ticket}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>{ticket.name || ticket.email}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.priority >= 3 ? "danger" : ticket.priority === 2 ? "warning" : "info"}>
                      {["Low", "Low", "Medium", "High"][ticket.priority] || "Low"}
                    </Badge>
                  </TableCell>
                  <TableCell><Badge variant={ticket.status === 0 ? "secondary" : ticket.status === 1 ? "success" : "danger"}>{["Open", "Answered", "Replied", "Closed"][ticket.status] || "Unknown"}</Badge></TableCell>
                  <TableCell className="text-muted text-xs">{ticket.last_reply ? new Date(ticket.last_reply).toLocaleDateString() : "—"}</TableCell>
                  <TableCell><Button variant="secondary" size="sm">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
