"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    const role = data.user.user_metadata?.role as string | undefined
    const redirect = searchParams.get("redirect") || (role === "super_admin" ? "/admin" : "/hotel")
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark">Welcome Back</h1>
        <p className="text-sm text-muted mt-1">Sign in to your TwiXHotel account</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-muted hover:text-dark"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
          <LogIn className="w-4 h-4" />
        </Button>
      </form>
      <div className="mt-6 text-center space-y-2">
        <Link href="/forgot-password" className="text-sm text-primary hover:underline block">
          Forgot password?
        </Link>
        <p className="text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
