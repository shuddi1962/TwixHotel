import { createAdminClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
        <Card>
          <CardHeader><CardTitle>Site Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="site_name" label="Site Name" defaultValue={settings?.site_name || ""} />
            <Input id="cur_text" label="Currency" defaultValue={settings?.cur_text || "USD"} />
            <Input id="cur_sym" label="Currency Symbol" defaultValue={settings?.cur_sym || "$"} />
            <Input id="email_from" label="Email From" defaultValue={settings?.email_from || ""} />
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="trial_duration" label="Trial Duration (days)" type="number" defaultValue={settings?.trial_duration?.toString() || "14"} />
            <Input id="paginate_number" label="Records Per Page" type="number" defaultValue={settings?.paginate_number?.toString() || "20"} />
            <Button>Save Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
