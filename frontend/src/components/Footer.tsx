import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/LogoMark'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/25">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
              <LogoMark className="h-4.5 w-4.5" />
            </div>
            <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-foreground">
              AEGIS<span className="text-primary">SHIELD</span>
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-safe" />
              Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: 'Analysis', path: '/detection' },
              { label: 'Analytics', path: '/analytics' },
              { label: 'Threats', path: '/threats' },
              { label: 'Audit', path: '/audit' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="focus-glow rounded-md px-1.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} AegisShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
