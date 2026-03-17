import { BarChart3 } from 'lucide-react'
import { SuperSpreaderTable } from '@/components/SuperSpreaderTable'
import { ContainmentPanel } from '@/components/ContainmentPanel'
import { AlertsPanel } from '@/components/AlertsPanel'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { PageBackground } from '@/components/PageBackground'
import { LogoMark } from '@/components/LogoMark'

export function ThreatsPage() {
  return (
    <PageBackground image="/threat.jpg" tone="threat">
      <main className="page-content mx-auto max-w-7xl px-6 py-10">
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-border/80 bg-card/35 animate-slide-up backdrop-blur-[2px]">
        <div className="relative px-6 py-7 md:px-8 md:py-8">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-threat">
            Threat Operations
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-threat/10 ring-1 ring-threat/20 backdrop-blur-sm">
              <LogoMark className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Threat Intelligence
            </h1>
          </div>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Real-time threat scoring, super-spreader rankings, and containment controls.
          </p>
        </div>
      </div>

      <RevealOnScroll delay={60}>
        <div className="card-glass mb-6 rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <BarChart3 className="h-4 w-4 text-threat" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Threat Ranking
            </span>
          </div>
          <SuperSpreaderTable />
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RevealOnScroll delay={80}>
          <ContainmentPanel />
        </RevealOnScroll>
        <RevealOnScroll delay={160}>
          <AlertsPanel />
        </RevealOnScroll>
      </div>
      </main>
    </PageBackground>
  )
}
