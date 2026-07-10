"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, phone: form.phone } },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: form.email,
        firstname: form.name.split(" ")[0],
        lastname: form.name.split(" ").slice(1).join(" "),
        mobile: form.phone,
        role: "hotel_admin",
      })
      await supabase.from("hotels").insert({
        user_id: data.user.id,
        name: `${form.name}'s Hotel`,
      })
    }
    router.push("/hotel")
    router.refresh()
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark">Create Account</h1>
        <p className="text-sm text-muted mt-1">Start your TwiXHotel journey</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input id="name" label="Full Name" placeholder="John Doe" value={form.name} onChange={update("name")} required />
        <Input id="email" label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={update("email")} required />
        <Input id="phone" label="Phone" placeholder="+1234567890" value={form.phone} onChange={update("phone")} />
        <div className="relative">
          <Input id="password" label="Password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={update("password")} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-muted hover:text-dark">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={update("confirmPassword")} required />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
          <UserPlus className="w-4 h-4" />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
