/** Estimated sales tax rate applied at checkout. */
export const TAX_RATE = 0.08

export interface OrderTotals {
  /** Sum of item final prices, in price minor units. */
  subtotal: number
  /** Estimated tax, rounded to nearest minor unit. */
  tax: number
  /** Subtotal + tax. */
  grand: number
}

/** Compute order totals for a list of cart items. */
export function calcOrderTotals(items: { game: { price: { final: number } } }[]): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.game.price.final, 0)
  return calcTotalsFromSubtotal(subtotal)
}

/** Compute totals when you already have the subtotal. */
export function calcTotalsFromSubtotal(subtotal: number): OrderTotals {
  const tax = Math.round(subtotal * TAX_RATE)
  return { subtotal, tax, grand: subtotal + tax }
}
