import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

async function saveSettings(formData: FormData) {
  "use server"
  const supabase = await createAdminClient()
  const data: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") data[key] = value
  }
  const { error } = await supabase.from("general_settings").update(data).eq("id", 1)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/settings")
}

export default async function AdminSettingsPage() {
  const supabase = await createAdminClient()
  const { data: settings } = await supabase.from("general_settings").select("*").single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">General Settings</h1>
        <p className="text-sm text-muted mt-1">Configure your platform settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form action={saveSettings}>
          <Card>
            <CardHeader><CardTitle>Site Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="id" value={settings?.id || 1} />
              <Input id="site_name" name="site_name" label="Site Name" defaultValue={settings?.site_name || ""} />
              <Input id="cur_text" name="cur_text" label="Currency" defaultValue={settings?.cur_text || "USD"} />
              <Input id="cur_sym" name="cur_sym" label="Currency Symbol" defaultValue={settings?.cur_sym || "$"} />
              <Input id="email_from" name="email_from" label="Email From" defaultValue={settings?.email_from || ""} />
              <Button type="submit">Save Settings</Button>
            </CardContent>
          </Card>
        </form>
        <form action={saveSettings}>
          <Card>
            <CardHeader><CardTitle>System Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="id" value={settings?.id || 1} />
              <Input id="trial_duration" name="trial_duration" label="Trial Duration (days)" type="number" defaultValue={settings?.trial_duration?.toString() || "14"} />
              <Input id="paginate_number" name="paginate_number" label="Records Per Page" type="number" defaultValue={settings?.paginate_number?.toString() || "20"} />
              <Button type="submit">Save Configuration</Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
