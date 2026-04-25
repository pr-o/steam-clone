import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import {
  ShoppingCart,
  X,
  CheckCircle2,
  Lock,
  ChevronLeft,
} from 'lucide-react'
import {
  cartItemsAtom,
  cartCountAtom,
  cartTotalAtom,
  removeFromCartAtom,
} from '@renderer/stores/cartStore'
import { checkoutAtom } from '@renderer/stores/purchasesStore'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@renderer/components/ui/sheet'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { formatPrice } from '@steam-clone/ui'
import { cn } from '@renderer/lib/utils'
import type { PurchasedGame } from '@steam-clone/types'

type Stage = 'cart' | 'pay' | 'success'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'wallet', label: 'Steam Wallet' },
] as const

type PaymentId = (typeof PAYMENT_METHODS)[number]['id']

export function CartSheet() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('cart')
  const [method, setMethod] = useState<PaymentId>('card')
  const [name, setName] = useState('')
  const [card, setCard] = useState('')
  const [purchased, setPurchased] = useState<PurchasedGame[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const items = useAtomValue(cartItemsAtom)
  const count = useAtomValue(cartCountAtom)
  const total = useAtomValue(cartTotalAtom)
  const removeFromCart = useSetAtom(removeFromCartAtom)
  const checkout = useSetAtom(checkoutAtom)

  // When the sheet closes, reset to cart stage so reopening starts fresh
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStage('cart')
        setIsProcessing(false)
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const tax = Math.round(total * 0.08)
  const grand = total + tax

  function handlePlaceOrder() {
    if (isProcessing || items.length === 0) return
    setIsProcessing(true)
    setTimeout(() => {
      const result = checkout()
      setPurchased(result)
      setStage('success')
      setIsProcessing(false)
    }, 700)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          className="relative w-full flex items-center justify-start gap-2 px-3 h-8 rounded-none text-[11px] font-semibold tracking-[0.08em] text-steam-textMuted hover:text-steam-text hover:bg-white/5 transition-colors"
        >
          <ShoppingCart size={13} />
          CART
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                className="ml-auto min-w-[16px] h-[16px] px-1 rounded-full bg-steam-blue text-white text-[9px] font-bold flex items-center justify-center tabular-nums"
              >
                {count > 99 ? '99+' : count}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-steam-bg border-l border-black/40 w-[380px] max-w-full p-0 flex flex-col"
      >
        <SheetHeader className="px-4 py-3 border-b border-black/40">
          <SheetTitle className="text-steam-text text-[14px] font-semibold flex items-center gap-2">
            {stage === 'cart' && (
              <>
                <ShoppingCart size={14} />
                Your Cart
              </>
            )}
            {stage === 'pay' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setStage('cart')}
                  aria-label="Back"
                  className="text-steam-textMuted hover:text-steam-text p-0 h-auto"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Lock size={13} className="text-steam-accentPale" />
                Secure Checkout
              </>
            )}
            {stage === 'success' && (
              <>
                <CheckCircle2 size={14} className="text-[#a4d007]" />
                Purchase Complete
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            {stage === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <ShoppingCart size={32} className="text-steam-textDim mb-3" />
                    <p className="text-steam-text text-[13px] mb-1">
                      Your cart is empty
                    </p>
                    <p className="text-steam-textMuted text-[11px]">
                      Browse the store and add games to get started.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 min-h-0">
                    <ul className="p-3 space-y-2">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.li
                            key={item.gameId}
                            layout
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center gap-3 bg-steam-card hover:bg-steam-cardHover rounded-sm p-2 transition-colors"
                          >
                            <img
                              src={item.game.headerImage}
                              alt={item.game.title}
                              className="w-[88px] h-[33px] object-cover rounded-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-steam-text text-[12px] font-medium leading-tight truncate">
                                {item.game.title}
                              </p>
                              <p className="text-steam-textMuted text-[10px] mt-0.5">
                                {item.game.price.isFree
                                  ? 'Free to Play'
                                  : formatPrice(item.game.price.final)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => removeFromCart(item.gameId)}
                              aria-label="Remove"
                              className="shrink-0 w-6 h-6 flex items-center justify-center text-steam-textMuted hover:text-steam-text hover:bg-white/5 rounded-sm transition-colors p-0"
                            >
                              <X size={12} />
                            </Button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </ScrollArea>
                )}

                {items.length > 0 && (
                  <div className="border-t border-black/40 p-3 space-y-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-steam-textMuted">Subtotal</span>
                      <span className="text-steam-text">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-steam-textMuted">Estimated tax</span>
                      <span className="text-steam-text">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[13px] border-t border-steam-borderSubtle pt-2">
                      <span className="text-steam-text">Total</span>
                      <span className="text-steam-text">{formatPrice(grand)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setStage('pay')}
                      className="mt-2 w-full text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {stage === 'pay' && (
              <motion.div
                key="pay"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-3 space-y-4">
                    <section>
                      <p className="text-steam-textDim text-[10px] uppercase tracking-wider mb-2">
                        Payment Method
                      </p>
                      <div className="flex flex-col gap-1">
                        {PAYMENT_METHODS.map((m) => {
                          const active = method === m.id
                          return (
                            <Button
                              key={m.id}
                              type="button"
                              variant="ghost"
                              onClick={() => setMethod(m.id)}
                              className={cn(
                                'flex items-center justify-start gap-2 px-3 py-2 h-auto rounded-sm border text-[12px] transition-colors text-left',
                                active
                                  ? 'border-steam-blue bg-steam-blue/10 text-steam-text'
                                  : 'border-steam-borderSubtle bg-steam-card text-steam-textMuted hover:text-steam-text'
                              )}
                            >
                              <span
                                className={cn(
                                  'shrink-0 w-3 h-3 rounded-full border-2 transition-colors',
                                  active
                                    ? 'border-steam-blue bg-steam-blue'
                                    : 'border-steam-textMuted'
                                )}
                              />
                              {m.label}
                            </Button>
                          )
                        })}
                      </div>
                    </section>

                    {method === 'card' && (
                      <motion.section
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-2"
                      >
                        <label className="flex flex-col gap-1">
                          <span className="text-steam-textDim text-[10px] uppercase tracking-wider">
                            Cardholder
                          </span>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="As shown on card"
                            className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm h-8 focus:border-steam-blue"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-steam-textDim text-[10px] uppercase tracking-wider">
                            Card number
                          </span>
                          <Input
                            inputMode="numeric"
                            value={card}
                            onChange={(e) =>
                              setCard(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))
                            }
                            placeholder="1234 5678 9012 3456"
                            className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm h-8 focus:border-steam-blue tracking-wider"
                          />
                        </label>
                      </motion.section>
                    )}

                    <p className="text-steam-textDim text-[10px] leading-relaxed">
                      Demo storefront. No real charge will be made.
                    </p>
                  </div>
                </ScrollArea>

                <div className="border-t border-black/40 p-3 space-y-2">
                  <div className="flex justify-between font-semibold text-[13px]">
                    <span className="text-steam-text">Total</span>
                    <span className="text-steam-text">{formatPrice(grand)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing…' : `Place Order — ${formatPrice(grand)}`}
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col h-full p-4"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05, type: 'spring', stiffness: 360, damping: 18 }}
                  className="self-center mb-3"
                >
                  <CheckCircle2 size={48} className="text-[#a4d007]" />
                </motion.div>

                <p className="text-steam-text text-[14px] font-semibold text-center">
                  Added {purchased.length}{' '}
                  {purchased.length === 1 ? 'game' : 'games'} to your library
                </p>
                <p className="text-steam-textMuted text-[11px] text-center mb-4">
                  No real charge was made.
                </p>

                <ScrollArea className="flex-1 min-h-0">
                  <ul className="space-y-2">
                    {purchased.map((p, i) => (
                      <motion.li
                        key={p.gameId}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="flex items-center gap-3 bg-steam-card rounded-sm p-2"
                      >
                        <img
                          src={p.game.headerImage}
                          alt={p.game.title}
                          className="w-[88px] h-[33px] object-cover rounded-sm shrink-0"
                        />
                        <p className="text-steam-text text-[12px] font-medium truncate">
                          {p.game.title}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </ScrollArea>

                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full text-[12px] font-semibold text-steam-text bg-steam-card hover:bg-steam-cardHover border border-steam-borderSubtle py-2 rounded-sm transition-colors"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
}
