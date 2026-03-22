import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Price } from '@steam-clone/types'

interface PriceDisplayProps {
  price: Price
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { badge: 'text-[11px]', original: 'text-[11px]', final: 'text-[13px]' },
  md: { badge: 'text-[12px]', original: 'text-[12px]', final: 'text-[15px]' },
  lg: { badge: 'text-[14px]', original: 'text-[13px]', final: 'text-[19px]' },
}

export function PriceDisplay({ price, className, size = 'md' }: PriceDisplayProps) {
  const s = sizes[size]

  if (price.isFree) {
    return <span className={cn('text-[#c7d5e0] font-semibold', s.final, className)}>Free to Play</span>
  }

  if (price.discountPercent > 0) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <span className={cn('bg-[#4c6b22] text-[#a4d007] font-bold px-1.5 py-0.5 rounded-sm', s.badge)}>
          -{price.discountPercent}%
        </span>
        <div className="flex flex-col">
          <span className={cn('text-[#8f98a0] line-through leading-none', s.original)}>
            {formatPrice(price.initial)}
          </span>
          <span className={cn('text-[#acdbf5] font-semibold leading-none', s.final)}>
            {formatPrice(price.final)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <span className={cn('text-[#c7d5e0] font-semibold', s.final, className)}>
      {formatPrice(price.final)}
    </span>
  )
}
