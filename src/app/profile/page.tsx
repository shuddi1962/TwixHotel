"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
      else setUser(data.user)
    })
  }, [router, supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    await supabase.from("users").update({
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      address: data.address,
      city: data.city,
      country: data.country,
    }).eq("id", user.id)
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-dark mb-6">Profile Settings</h1>
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstname" name="firstname" label="First Name" defaultValue={user.user_metadata?.full_name?.split(" ")[0] || ""} />
              <Input id="lastname" name="lastname" label="Last Name" defaultValue={user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || ""} />
            </div>
            <Input id="email" label="Email" defaultValue={user.email} disabled />
            <Input id="mobile" name="mobile" label="Mobile" defaultValue={user.user_metadata?.phone || ""} />
            <Input id="address" name="address" label="Address" />
            <div className="grid grid-cols-2 gap-4">
              <Input id="city" name="city" label="City" />
              <Input id="country" name="country" label="Country" />
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
