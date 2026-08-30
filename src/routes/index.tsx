import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const ScrollExperience = lazy(() =>
  import('#/components/landing/ScrollExperience').then(m => ({ default: m.ScrollExperience }))
)

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500 uppercase tracking-widest">Initializing</p>
          </div>
        </div>
      }
    >
      <ScrollExperience />
    </Suspense>
  )
}
