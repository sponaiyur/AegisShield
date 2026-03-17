import type { ReactNode } from 'react'

type PageTone = 'primary' | 'info' | 'safe' | 'threat'

type PageBackgroundProps = {
  image: string
  tone?: PageTone
  imageMode?: 'cover' | 'contain'
  imageFixed?: boolean
  animateImage?: boolean
  children: ReactNode
}

const toneClass: Record<PageTone, string> = {
  primary: 'page-scene-overlay-primary',
  info: 'page-scene-overlay-info',
  safe: 'page-scene-overlay-safe',
  threat: 'page-scene-overlay-threat',
}

export function PageBackground({
  image,
  tone = 'primary',
  imageMode = 'cover',
  imageFixed = false,
  animateImage = true,
  children,
}: PageBackgroundProps) {
  const imageClasses = [
    'page-scene-image',
    imageMode === 'contain' ? 'page-scene-image-contain' : '',
    imageFixed ? 'page-scene-image-fixed' : '',
    animateImage ? 'animate-bg-drift' : '',
  ].join(' ').trim()

  return (
    <div className="page-scene">
      <div className="page-scene-media" aria-hidden>
        <div className={imageClasses} style={{ backgroundImage: `url(${image})` }} />
        <div className={`page-scene-overlay ${toneClass[tone]}`} />
        <div className="page-scene-grid" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
