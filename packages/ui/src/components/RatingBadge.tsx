import React from 'react'
import { getRatingColor, cn } from '../lib/utils'

interface RatingBadgeProps {
  summary: string
  score?: number
  className?: string
  showScore?: boolean
}

export function RatingBadge({ summary, score, className, showScore = false }: RatingBadgeProps) {
  const color = getRatingColor(summary)
  return (
    <span className={cn('text-[11px] font-medium', className)} style={{ color }}>
      {summary}
      {showScore && score !== undefined && (
        <span className="text-[#8f98a0] ml-1">({score.toLocaleString()})</span>
      )}
    </span>
  )
}
