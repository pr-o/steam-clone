'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAtomValue, useSetAtom } from 'jotai'
import { X } from 'lucide-react'
import { cartItemsAtom, cartTotalAtom, removeFromCartAtom } from '@/stores/cartStore'
import { useFeaturedGames } from '@/hooks/useGames'
import { Skeleton } from '@/components/ui/skeleton'
import { GameCard } from '@steam-clone/ui'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import type { CartItem } from '@steam-clone/types'

function CartRow({ item }: { item: CartItem }) {
  const remove = useSetAtom(removeFromCartAtom)
  const { game } = item

  return (
    <div className="flex items-center gap-4 py-4 border-b border-steam-borderSubtle">
      <Link href={`/app/${game.id}/${game.slug}`} className="shrink-0">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-[184px] h-[69px] object-cover rounded-sm hover:opacity-90 transition-opacity"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/app/${game.id}/${game.slug}`}
          className="text-steam-text text-[15px] font-medium hover:text-steam-link transition-colors leading-tight block truncate"
        >
          {game.title}
        </Link>
        <p className="text-steam-textMuted text-[12px] mt-0.5">{game.developer}</p>
        <Button
          variant="ghost"
          onClick={() => remove(game.id)}
          className="mt-1.5 flex items-center gap-1 text-steam-link hover:text-steam-linkHover text-[12px] transition-colors h-auto p-0"
        >
          <X size={11} />
          Remove
        </Button>
      </div>

      <div className="shrink-0 text-right">
        <PriceDisplay price={game.price} size="sm" />
      </div>
    </div>
  )
}

function OrderSummary() {
  const items = useAtomValue(cartItemsAtom)
  const total = useAtomValue(cartTotalAtom)
  const isEmpty = items.length === 0

  return (
    <div className="bg-[#c2c2c2]/5 border border-steam-borderSubtle rounded-sm p-4 sticky top-[76px]">
      <h3 className="text-steam-textDim text-[11px] uppercase tracking-wider mb-3">Estimated total</h3>

      {!isEmpty && (
        <div className="flex flex-col gap-1 mb-3 text-[13px]">
          {items.map(item => (
            <div key={item.gameId} className="flex justify-between gap-2">
              <span className="text-steam-textMuted truncate">{item.game.title}</span>
              <span className="text-steam-text shrink-0">
                {item.game.price.isFree ? 'Free' : formatPrice(item.game.price.final)}
              </span>
            </div>
          ))}
          <div className="border-t border-steam-borderSubtle mt-2 pt-2 flex justify-between font-semibold">
            <span className="text-steam-text">Total</span>
            <span className="text-steam-text">{formatPrice(total)}</span>
          </div>
          <p className="text-steam-textDim text-[11px] mt-1">
            Sales tax will be calculated during checkout where applicable.
          </p>
        </div>
      )}

      <Button
        variant="ghost"
        disabled={isEmpty}
        className="w-full py-2 text-[13px] font-semibold text-white rounded-sm transition-colors
          bg-[#5c7e10] hover:bg-[#6b9313] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#5c7e10]"
      >
        Continue to payment
      </Button>

      {!isEmpty && (
        <p className="text-steam-textDim text-[11px] mt-3 leading-relaxed">
          A purchase of a digital product grants a license for the product on Steam.{' '}
          <Link href="#" className="text-steam-link hover:text-steam-linkHover transition-colors">
            See full terms and conditions
          </Link>
          , about the Steam Subscriber Agreement.
        </p>
      )}
    </div>
  )
}

export default function CartPage() {
  const router = useRouter()
  const items = useAtomValue(cartItemsAtom)
  const { data: recommended, isLoading } = useFeaturedGames()
  const isEmpty = items.length === 0

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      <h1 className="text-steam-text text-[22px] font-semibold mb-4">Your Shopping Cart</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Cart items */}
        <div className="flex-1 min-w-0">
          {isEmpty ? (
            <div className="py-4">
              <p className="text-steam-textMuted text-[14px] mb-4">Your cart is empty.</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {items.map(item => <CartRow key={item.gameId} item={item} />)}
              <div className="flex justify-end pt-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-[12px] text-steam-link hover:text-steam-linkHover transition-colors h-auto p-0"
                >
                  ← Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="w-full md:w-[280px] shrink-0">
          <OrderSummary />
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-10 pt-6 border-t border-steam-borderSubtle">
        <h2 className="text-steam-navActive text-[13px] font-normal uppercase tracking-[0.12em] mb-3">
          Recommendations for you
        </h2>
        <ScrollArea>
          <div className="flex gap-2 pb-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-[220px] shrink-0">
                    <Skeleton className="w-full h-[103px] rounded-sm bg-steam-card" />
                    <Skeleton className="w-full h-[56px] rounded-sm bg-steam-card mt-0.5" />
                  </div>
                ))
              : recommended?.map(game => (
                  <div key={game.id} className="w-[220px] shrink-0">
                    <GameCard game={game} onClick={g => router.push(`/app/${g.id}/${g.slug}`)} />
                  </div>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
