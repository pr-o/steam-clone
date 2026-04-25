'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion } from 'motion/react'
import { Lock, ChevronLeft } from 'lucide-react'
import { cartItemsAtom, cartTotalAtom } from '@/stores/cartStore'
import { checkoutAtom } from '@/stores/purchasesStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice, cn } from '@/lib/utils'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, Amex' },
  { id: 'paypal', label: 'PayPal', subtitle: 'Pay with your PayPal account' },
  { id: 'wallet', label: 'Steam Wallet', subtitle: 'Use your wallet balance' },
] as const

type PaymentId = (typeof PAYMENT_METHODS)[number]['id']

export default function CheckoutPage() {
  const router = useRouter()
  const items = useAtomValue(cartItemsAtom)
  const total = useAtomValue(cartTotalAtom)
  const checkout = useSetAtom(checkoutAtom)

  const [method, setMethod] = useState<PaymentId>('card')
  const [name, setName] = useState('')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const isEmpty = items.length === 0
  const tax = Math.round(total * 0.08)
  const grand = total + tax

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isEmpty || isProcessing) return
    setIsProcessing(true)
    // Simulate brief processing then complete
    setTimeout(() => {
      const purchased = checkout()
      const ids = purchased.map((p) => p.gameId).join(',')
      router.push(`/checkout/success?ids=${ids}`)
    }, 700)
  }

  if (isEmpty) {
    return (
      <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-10">
        <h1 className="text-steam-text text-[22px] font-semibold mb-2">Checkout</h1>
        <p className="text-steam-textMuted text-[14px] mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-[12px] text-steam-link hover:text-steam-linkHover transition-colors mb-3"
      >
        <ChevronLeft size={13} /> Back to Cart
      </Link>

      <h1 className="text-steam-text text-[22px] font-semibold mb-4 flex items-center gap-2">
        <Lock size={16} className="text-steam-accentPale" />
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-start">
        {/* Form */}
        <div className="flex-1 min-w-0 w-full">
          {/* Payment method */}
          <section className="mb-6">
            <h2 className="text-steam-textDim text-[11px] uppercase tracking-wider mb-2">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((m) => {
                const active = method === m.id
                return (
                  <Button
                    key={m.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'relative flex items-center justify-start gap-3 px-4 py-3 h-auto rounded-sm border transition-colors text-left',
                      active
                        ? 'border-steam-blue bg-steam-blue/10'
                        : 'border-steam-borderSubtle hover:border-steam-textMuted bg-steam-card'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-3.5 h-3.5 rounded-full border-2 transition-colors',
                        active ? 'border-steam-blue bg-steam-blue' : 'border-steam-textMuted'
                      )}
                    />
                    <span className="flex flex-col">
                      <span className="text-steam-text text-[13px] font-semibold leading-tight">
                        {m.label}
                      </span>
                      <span className="text-steam-textMuted text-[11px] leading-tight mt-0.5">
                        {m.subtitle}
                      </span>
                    </span>
                  </Button>
                )
              })}
            </div>
          </section>

          {/* Card details */}
          {method === 'card' && (
            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mb-6 bg-steam-card rounded-sm p-4 space-y-3"
            >
              <h2 className="text-steam-textDim text-[11px] uppercase tracking-wider">
                Card Details
              </h2>

              <FieldLabel label="Cardholder Name">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As shown on card"
                  className="bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue"
                />
              </FieldLabel>

              <FieldLabel label="Card Number">
                <Input
                  inputMode="numeric"
                  value={card}
                  onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
                  placeholder="1234 5678 9012 3456"
                  className="bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue tracking-wider"
                />
              </FieldLabel>

              <div className="grid grid-cols-2 gap-3">
                <FieldLabel label="Expiry">
                  <Input
                    inputMode="numeric"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                    placeholder="MM / YY"
                    className="bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue"
                  />
                </FieldLabel>
                <FieldLabel label="CVV">
                  <Input
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                    placeholder="•••"
                    className="bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue"
                  />
                </FieldLabel>
              </div>
            </motion.section>
          )}

          <p className="text-steam-textDim text-[11px] leading-relaxed">
            This is a demo storefront. No real payment is processed and no card data is sent
            anywhere — submitting this form completes a mock purchase against your local mock
            data.
          </p>
        </div>

        {/* Summary */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="bg-[#c2c2c2]/5 border border-steam-borderSubtle rounded-sm p-4 sticky top-[76px]">
            <h3 className="text-steam-textDim text-[11px] uppercase tracking-wider mb-3">
              Order Summary
            </h3>

            <ul className="flex flex-col gap-2 mb-3 text-[12px]">
              {items.map((item) => (
                <li key={item.gameId} className="flex items-start gap-2">
                  <img
                    src={item.game.headerImage}
                    alt=""
                    className="w-12 h-7 object-cover rounded-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-steam-text leading-tight truncate">{item.game.title}</p>
                    <p className="text-steam-textDim text-[11px]">{item.game.developer}</p>
                  </div>
                  <span className="text-steam-text shrink-0">
                    {item.game.price.isFree ? 'Free' : formatPrice(item.game.price.final)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="border-t border-steam-borderSubtle pt-3 space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-steam-textMuted">Subtotal</dt>
                <dd className="text-steam-text">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steam-textMuted">Estimated tax</dt>
                <dd className="text-steam-text">{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-steam-borderSubtle pt-2 mt-2 font-semibold">
                <dt className="text-steam-text">Total</dt>
                <dd className="text-steam-text">{formatPrice(grand)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              disabled={isProcessing}
              variant="ghost"
              className="mt-4 w-full py-2.5 text-[13px] font-semibold text-white rounded-sm transition-colors bg-[#5c7e10] hover:bg-[#6b9313] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing…' : `Place Order — ${formatPrice(grand)}`}
            </Button>

            <p className="text-steam-textDim text-[11px] mt-3 leading-relaxed">
              By placing your order you agree to the Steam Subscriber Agreement.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

function FieldLabel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-steam-textDim text-[11px] uppercase tracking-wider">{label}</span>
      {children}
    </label>
  )
}
