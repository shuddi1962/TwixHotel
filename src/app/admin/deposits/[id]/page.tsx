import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminDepositDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: deposit } = await supabase
    .from("deposits")
    .select("*")
    .eq("id", id)
    .single()

  if (!deposit) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/deposits"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark">Deposit Details</h1>
          <p className="text-sm text-muted mt-1">Transaction {deposit.trx || id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Transaction Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">TRX</span><span className="font-mono">{deposit.trx || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted">User ID</span><span className="font-mono text-xs">{deposit.user_id}</span></div>
            <div className="flex justify-between"><span className="text-muted">Method</span><span>{deposit.method || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Currency</span><span>{deposit.method_currency || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-medium">${Number(deposit.amount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Charge</span><span>${Number(deposit.charge).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Final Amount</span><span className="font-medium">${Number(deposit.final_amount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Rate</span><span>{deposit.rate || "1.00"}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status & Dates</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Status</span>
              <Badge variant={deposit.status === 1 ? "success" : deposit.status === 2 ? "warning" : "danger"}>
                {deposit.status === 1 ? "Approved" : deposit.status === 2 ? "Pending" : "Rejected"}
              </Badge>
            </div>
            <div className="flex justify-between"><span className="text-muted">Created</span><span>{new Date(deposit.created_at).toLocaleString()}</span></div>
            {deposit.updated_at && (
              <div className="flex justify-between"><span className="text-muted">Updated</span><span>{new Date(deposit.updated_at).toLocaleString()}</span></div>
            )}
            {deposit.admin_feedback && (
              <div className="pt-3 border-t border-border">
                <span className="text-muted block mb-1">Admin Feedback</span>
                <p className="text-dark">{deposit.admin_feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        {deposit.status === 2 && (
          <>
            <Button variant="success">Approve</Button>
            <Button variant="danger">Reject</Button>
          </>
        )}
      </div>
    </div>
  )
}
