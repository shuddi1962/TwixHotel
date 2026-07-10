import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function HotelSettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: hotel } = await supabase.from("hotels").select("*").eq("user_id", user.id).single()
  if (!hotel) redirect("/setup")

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Hotel Settings</h1><p className="text-sm text-muted mt-1">Configure your hotel profile and preferences</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Hotel Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="name" label="Hotel Name" defaultValue={hotel.name} />
            <Input id="email" label="Email" defaultValue={hotel.email || ""} />
            <Input id="phone" label="Phone" defaultValue={hotel.phone || ""} />
            <Input id="address" label="Address" defaultValue={hotel.address || ""} />
            <Input id="city" label="City" defaultValue={hotel.city || ""} />
            <Input id="country" label="Country" defaultValue={hotel.country || ""} />
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Operations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="check_in" label="Check-in Time" defaultValue={hotel.check_in_time || "14:00"} />
            <Input id="check_out" label="Check-out Time" defaultValue={hotel.check_out_time || "12:00"} />
            <Input id="currency" label="Currency" defaultValue={hotel.currency || "USD"} />
            <Input id="currency_sym" label="Currency Symbol" defaultValue={hotel.currency_symbol || "$"} />
            <Input id="timezone" label="Timezone" defaultValue={hotel.timezone || "UTC"} />
            <Button>Save Operations</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
