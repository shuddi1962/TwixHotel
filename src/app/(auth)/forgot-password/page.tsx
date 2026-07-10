"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center">
        <div className="p-4 rounded-full bg-success/10 text-success w-fit mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-dark mb-2">Check Your Email</h1>
        <p className="text-sm text-muted mb-6">We&apos;ve sent password reset instructions to {email}</p>
        <Link href="/login"><Button variant="secondary">Back to Login</Button></Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark">Reset Password</h1>
        <p className="text-sm text-muted mt-1">Enter your email to receive reset instructions</p>
      </div>
      <form onSubmit={handleReset} className="space-y-4">
        <Input id="email" label="Email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <Link href="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>
    </div>
  )
}
