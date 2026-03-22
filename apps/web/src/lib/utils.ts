import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RATING_COLOR } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price ────────────────────────────────────────────────────────────────────

export function formatPrice(cents: number): string {
  if (cents <= 0) return 'Free'
  return `$${(cents / 100).toFixed(2)}`
}

// ─── Date ─────────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Genre ────────────────────────────────────────────────────────────────────

export function formatGenreName(raw: string): string {
  return raw
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ─── Rating ───────────────────────────────────────────────────────────────────

export function getRatingColor(summary: string, fallback = '#8f98a0'): string {
  return RATING_COLOR[summary] ?? fallback
}
