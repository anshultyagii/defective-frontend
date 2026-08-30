import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const DataUploadPanel = lazy(() =>
  import('#/components/upload/DataUploadPanel').then(m => ({ default: m.DataUploadPanel }))
)

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

function UploadPage() {
  return (
    <div className="min-h-screen bg-[#020617] relative">
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />

      {/* Atmospheric gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 uppercase tracking-widest">Loading Mission Interface</p>
            </div>
          </div>
        }
      >
        <DataUploadPanel />
      </Suspense>
    </div>
  )
}
