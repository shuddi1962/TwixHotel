"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare } from "lucide-react"
import type { Database } from "@/types/database"

type Ticket = Database["public"]["Tables"]["support_tickets"]["Row"]

export default function TicketsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
      else loadTickets(data.user.id)
    })
  }, [router, supabase])

  const loadTickets = async (userId: string) => {
    const { data } = await supabase.from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false })
    setTickets(data || [])
  }

  const createTicket = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase()
    await supabase.from("support_tickets").insert({
      user_id: user.id,
      name: user.email,
      email: user.email,
      ticket: ticketId,
      subject,
      status: 0,
      priority: 1,
    })
    setShowForm(false)
    setSubject("")
    loadTickets(user.id)
  }

  const statusBadge = (s: number) => {
    const map: Record<number, "success" | "warning" | "danger" | "secondary"> = { 0: "warning", 1: "success", 2: "info", 3: "secondary" }
    return map[s] || "secondary"
  }
  const statusLabel = ["Open", "Answered", "Replied", "Closed"]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark">Support Tickets</h1><p className="text-sm text-muted mt-1">Get help from our support team</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Ticket</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Create Ticket</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="subject" label="Subject" placeholder="Brief description of your issue" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">Message</label>
              <textarea className="input-field min-h-[100px]" placeholder="Describe your issue in detail..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button onClick={createTicket} disabled={!subject}>Submit Ticket</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card><CardContent className="p-0">
        {tickets.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-5 h-5 text-muted" />
              <div>
                <p className="text-sm font-medium">{t.subject}</p>
                <p className="text-xs text-muted">#{t.ticket} - {new Date(t.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge variant={statusBadge(t.status)}>{statusLabel[t.status]}</Badge>
          </div>
        ))}
        {tickets.length === 0 && <p className="text-center py-8 text-muted">No tickets yet</p>}
      </CardContent></Card>
    </div>
  )
}
