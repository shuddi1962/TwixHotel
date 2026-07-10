"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hotel, ArrowRight, Check } from "lucide-react"

const steps = ["Hotel Details", "Configure", "Choose Template", "Done"]

export default function SetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [hotelName, setHotelName] = useState("")
  const [checkIn, setCheckIn] = useState("14:00")
  const [checkOut, setCheckOut] = useState("12:00")
  const [currency, setCurrency] = useState("USD")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
    })
  }, [router, supabase])

  const handleComplete = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("hotels").upsert({
      user_id: user.id,
      name: hotelName || `${user.email}'s Hotel`,
      check_in_time: checkIn,
      check_out_time: checkOut,
      currency,
    })

    await supabase.from("services").insert({
      user_id: user.id,
      is_free_trial: 1,
      status: 1,
    })

    router.push("/hotel")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Hotel className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">TwiXHotel Setup</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-primary text-white" : "bg-gray-200 text-muted"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? "text-dark font-medium" : "text-muted"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>{steps[step]}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <>
                <Input id="hotelName" label="Hotel Name" placeholder="My Luxury Hotel" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                <Input id="checkIn" label="Check-in Time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                <Input id="checkOut" label="Check-out Time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </>
            )}
            {step === 1 && (
              <>
                <Input id="currency" label="Currency" placeholder="USD" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                <p className="text-sm text-muted">You can configure more settings later from the hotel settings page.</p>
              </>
            )}
            {step === 2 && (
              <div>
                <p className="text-sm text-muted mb-4">Choose a template for your hotel website. You can change this later.</p>
                <div className="grid grid-cols-2 gap-4">
                  {["Luxury", "Oasis"].map((t) => (
                    <div key={t} className="p-6 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors text-center">
                      <p className="font-semibold">{t}</p>
                      <p className="text-xs text-muted mt-1">Hotel template</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="p-4 rounded-full bg-success/10 text-success w-fit mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All Set!</h3>
                <p className="text-sm text-muted mb-4">Your hotel is ready to go. Start managing your property.</p>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? "Setting Up..." : "Go to Dashboard"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
