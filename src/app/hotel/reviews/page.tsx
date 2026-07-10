import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"

export default async function ReviewsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: hotel } = await supabase.from("hotels").select("id").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  const { data: reviews } = await supabase.from("reviews").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Guest Reviews</h1><p className="text-sm text-muted mt-1">See what guests are saying</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Guest</TableHead><TableHead>Rating</TableHead><TableHead>Comment</TableHead><TableHead>Date</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {(reviews || []).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.guest_name || "Anonymous"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate text-muted">{r.comment || "—"}</TableCell>
                <TableCell className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  )
}
