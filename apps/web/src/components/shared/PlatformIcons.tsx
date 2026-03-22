import { Monitor, Apple, X as LinuxIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Platforms } from '@steam-clone/types'

interface PlatformIconsProps {
  platforms: Platforms
  size?: number
  className?: string
}

export function PlatformIcons({ platforms, size = 13, className }: PlatformIconsProps) {
  return (
    <span className={cn('flex items-center gap-1 text-[#8f98a0]', className)}>
      {platforms.windows && <Monitor size={size} />}
      {platforms.mac && <Apple size={size} />}
      {platforms.linux && <LinuxIcon size={size} />}
    </span>
  )
}
