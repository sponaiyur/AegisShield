import { useEffect, useState } from 'react'
import { LogoMark } from '@/components/LogoMark'

const BOOT_MESSAGES = [
  'INITIALIZING AEGIS CORE MODULES...',
  'LOADING THREAT INTELLIGENCE DATABASE...',
  'CALIBRATING PROPAGATION ANALYSIS ENGINE...',
  'ESTABLISHING SECURE NODE CONNECTIONS...',
  'DEPLOYING CONTAINMENT PROTOCOLS...',
  'SYNCHRONIZING NETWORK TOPOLOGY...',
  'SYSTEM READY — ALL MODULES ONLINE',
]

interface LoadingScreenProps {
  onDone: () => void
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const step = 2200 / BOOT_MESSAGES.length
    const msgTimer = setInterval(() => {
      setMsgIdx((prev) => {
        if (prev >= BOOT_MESSAGES.length - 1) {
          clearInterval(msgTimer)
          return prev
        }
        return prev + 1
      })
    }, step)

    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100))
    }, 44)

    const doneTimer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(onDone, 500)
    }, 2400)

    return () => {
      clearInterval(msgTimer)
      clearInterval(progTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className="loading-screen"
      style={{
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Hex grid background */}
      <div className="loading-hex-bg" />

      {/* Vertical scan line */}
      <div className="relative h-full w-full overflow-hidden" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="loading-v-scan" />
      </div>

      {/* Corner brackets */}
      <svg className="absolute left-6 top-6 h-10 w-10 text-primary/30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 14 L0 0 L14 0" strokeDasharray="40" strokeDashoffset="0" style={{ animation: 'bracket-draw 0.6s ease 0.1s both' }} />
      </svg>
      <svg className="absolute right-6 top-6 h-10 w-10 text-primary/30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M40 14 L40 0 L26 0" strokeDasharray="40" strokeDashoffset="0" style={{ animation: 'bracket-draw 0.6s ease 0.15s both' }} />
      </svg>
      <svg className="absolute bottom-6 left-6 h-10 w-10 text-primary/30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 26 L0 40 L14 40" strokeDasharray="40" strokeDashoffset="0" style={{ animation: 'bracket-draw 0.6s ease 0.2s both' }} />
      </svg>
      <svg className="absolute bottom-6 right-6 h-10 w-10 text-primary/30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M40 26 L40 40 L26 40" strokeDasharray="40" strokeDashoffset="0" style={{ animation: 'bracket-draw 0.6s ease 0.25s both' }} />
      </svg>

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-5 animate-slide-up">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/40">
          <LogoMark className="h-8 w-8 drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold tracking-[0.25em] text-foreground">
            AEGIS<span className="text-primary">SHIELD</span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">REGULATORY DEFENSE PLATFORM</div>
        </div>
      </div>

      {/* Boot message */}
      <div className="relative w-full max-w-sm space-y-3 px-6 text-center">
        <p className="font-mono text-[11px] text-primary/80 min-h-[16px]">
          {BOOT_MESSAGES[msgIdx]}
          <span className="loading-cursor" />
        </p>
        <div className="h-px w-full rounded-full bg-border overflow-hidden">
          <div
            className="loading-progress-bar"
            style={{ width: `${progress}%`, animationDuration: '2.2s' }}
          />
        </div>
        <p className="font-mono text-[10px] tabular-nums text-muted-foreground">{progress}%</p>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-6 font-mono text-[10px] text-muted-foreground">
        {['NODE GRAPH', 'THREAT DB', 'NLP MODEL'].map((label) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-safe" />
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
