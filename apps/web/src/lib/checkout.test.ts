import { describe, expect, it } from 'vitest'
import { TAX_RATE, calcOrderTotals, calcTotalsFromSubtotal } from '@steam-clone/ui'

describe('calcTotalsFromSubtotal', () => {
  it('returns zero totals for an empty subtotal', () => {
    const totals = calcTotalsFromSubtotal(0)
    expect(totals).toEqual({ subtotal: 0, tax: 0, grand: 0 })
  })

  it('rounds tax to the nearest minor unit', () => {
    // 1234 * 0.08 = 98.72 → rounded to 99
    const totals = calcTotalsFromSubtotal(1234)
    expect(totals.tax).toBe(99)
    expect(totals.grand).toBe(1234 + 99)
  })

  it('uses TAX_RATE consistently', () => {
    const subtotal = 5000
    const totals = calcTotalsFromSubtotal(subtotal)
    expect(totals.tax).toBe(Math.round(subtotal * TAX_RATE))
  })
})

describe('calcOrderTotals', () => {
  it('sums final prices across items', () => {
    const items = [
      { game: { price: { final: 1599 } } },
      { game: { price: { final: 3599 } } },
      { game: { price: { final: 0 } } },
    ]
    const totals = calcOrderTotals(items)
    expect(totals.subtotal).toBe(5198)
    expect(totals.grand).toBe(5198 + Math.round(5198 * TAX_RATE))
  })

  it('handles an empty cart without throwing', () => {
    expect(calcOrderTotals([])).toEqual({ subtotal: 0, tax: 0, grand: 0 })
  })
})
