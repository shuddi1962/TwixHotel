import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

async function saveHotelSettings(formData: FormData) {
  "use server"
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const data: Record<string, string | number> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") data[key] = value
  }
  const { error } = await supabase.from("hotels").update(data).eq("user_id", user.id)
  if (error) throw new Error(error.message)
  revalidatePath("/hotel/settings")
}

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
        <form action={saveHotelSettings}>
          <Card>
            <CardHeader><CardTitle>Hotel Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input id="name" name="name" label="Hotel Name" defaultValue={hotel.name} />
              <Input id="email" name="email" label="Email" defaultValue={hotel.email || ""} />
              <Input id="phone" name="phone" label="Phone" defaultValue={hotel.phone || ""} />
              <Input id="address" name="address" label="Address" defaultValue={hotel.address || ""} />
              <Input id="city" name="city" label="City" defaultValue={hotel.city || ""} />
              <Input id="country" name="country" label="Country" defaultValue={hotel.country || ""} />
              <Button type="submit">Save Changes</Button>
            </CardContent>
          </Card>
        </form>
        <form action={saveHotelSettings}>
          <Card>
            <CardHeader><CardTitle>Operations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input id="check_in_time" name="check_in_time" label="Check-in Time" defaultValue={hotel.check_in_time || "14:00"} />
              <Input id="check_out_time" name="check_out_time" label="Check-out Time" defaultValue={hotel.check_out_time || "12:00"} />
              <Input id="currency" name="currency" label="Currency" defaultValue={hotel.currency || "USD"} />
              <Input id="currency_symbol" name="currency_symbol" label="Currency Symbol" defaultValue={hotel.currency_symbol || "$"} />
              <Input id="timezone" name="timezone" label="Timezone" defaultValue={hotel.timezone || "UTC"} />
              <Button type="submit">Save Operations</Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
