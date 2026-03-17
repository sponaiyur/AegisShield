type LogoMarkProps = {
  className?: string
  alt?: string
}

export function LogoMark({ className = 'h-5 w-5', alt = 'AegisShield logo' }: LogoMarkProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`logo-spin-soft object-contain ${className}`}
      loading="eager"
    />
  )
}
