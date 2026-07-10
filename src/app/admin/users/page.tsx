import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default async function AdminUsersPage() {
  const supabase = await createAdminClient()
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Users</h1>
          <p className="text-sm text-muted mt-1">Manage all platform users</p>
        </div>
        <Button> <Plus className="w-4 h-4" /> Add User </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input className="input-field pl-9" placeholder="Search users..." />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users || []).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstname || user.email}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "super_admin" ? "info" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 1 ? "success" : "danger"}>
                      {user.status === 1 ? "Active" : "Banned"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!users || users.length === 0) && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
