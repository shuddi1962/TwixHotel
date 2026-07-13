"use client"

export function CookieBanner() {
  return (
    <div className="fixed bottom-8 right-8 left-8 md:left-auto md:w-[380px] bg-white p-6 shadow-2xl z-[100] border-t-2 border-warm-bronze animate-fade-in" id="cookie-banner">
      <div className="flex items-start gap-4">
        <span className="material-symbols-outlined text-warm-bronze text-3xl">cookie</span>
        <div>
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            We use cookies to enhance your luxury experience. By continuing, you agree to our{' '}
            <a className="text-primary underline" href="#">Cookie Policy</a>.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-warm-bronze text-white px-6 py-2 text-[10px] tracking-widest font-semibold uppercase hover:bg-primary transition-all"
              onClick={() => {
                const el = document.getElementById("cookie-banner")
                if (el) el.remove()
              }}
            >
              Allow
            </button>
            <button
              className="text-on-surface-variant text-[10px] tracking-widest font-semibold uppercase"
              onClick={() => {
                const el = document.getElementById("cookie-banner")
                if (el) el.remove()
              }}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
