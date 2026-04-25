'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { CheckCircle2, Download } from 'lucide-react'
import { purchasesAtom } from '@/stores/purchasesStore'
import { formatPrice } from '@/lib/utils'

function SuccessContent() {
  const searchParams = useSearchParams()
  const purchases = useAtomValue(purchasesAtom)

  const justPurchasedIds = useMemo(() => {
    const raw = searchParams.get('ids')
    if (!raw) return new Set<number>()
    return new Set(
      raw
        .split(',')
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n))
    )
  }, [searchParams])

  const justPurchased = useMemo(
    () => purchases.filter((p) => justPurchasedIds.has(p.gameId)),
    [purchases, justPurchasedIds]
  )

  const total = justPurchased.reduce((sum, p) => sum + p.totalPaid, 0)
  const orderRef = useMemo(
    () =>
      `STM-${Math.floor(Math.random() * 1_000_000)
        .toString()
        .padStart(6, '0')}`,
    []
  )

  if (justPurchased.length === 0) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-16 text-center">
        <p className="text-steam-textMuted text-[14px] mb-3">
          We couldn&apos;t find that order. It may have already been processed.
        </p>
        <Link
          href="/"
          className="inline-block text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors"
        >
          Back to Store
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-0 py-10">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45] border border-[#2a5a7a]/60 rounded-sm p-6 mb-6 flex items-start gap-4"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 18 }}
          className="shrink-0 mt-0.5"
        >
          <CheckCircle2 size={32} className="text-[#a4d007]" />
        </motion.span>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[22px] font-semibold leading-tight">
            Thanks for your purchase!
          </h1>
          <p className="text-steam-text text-[13px] mt-1">
            Order <span className="text-steam-accentPale font-mono">{orderRef}</span> has been
            confirmed and added to your library.
          </p>
        </div>
      </motion.div>

      {/* Receipt */}
      <section className="bg-steam-card rounded-sm p-5 mb-6">
        <h2 className="text-steam-textDim text-[11px] uppercase tracking-wider mb-3">
          Items added to your library
        </h2>

        <ul className="flex flex-col">
          {justPurchased.map((p, i) => (
            <motion.li
              key={p.gameId}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.22 }}
              className="flex items-center gap-3 py-3 border-b border-steam-borderSubtle last:border-b-0"
            >
              <Link href={`/app/${p.gameId}/${p.game.slug}`} className="shrink-0">
                <img
                  src={p.game.headerImage}
                  alt={p.game.title}
                  className="w-[120px] h-[45px] object-cover rounded-sm hover:opacity-90 transition-opacity"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/app/${p.gameId}/${p.game.slug}`}
                  className="text-steam-text text-[13px] font-medium hover:text-steam-link transition-colors block truncate"
                >
                  {p.game.title}
                </Link>
                <p className="text-steam-textMuted text-[11px]">{p.game.developer}</p>
              </div>
              <span className="shrink-0 text-steam-text text-[13px]">
                {p.game.price.isFree ? 'Free' : formatPrice(p.totalPaid)}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="border-t border-steam-borderSubtle mt-3 pt-3 flex justify-between text-[13px]">
          <span className="text-steam-textMuted">Total charged</span>
          <span className="text-steam-text font-semibold">
            {formatPrice(total + Math.round(total * 0.08))}
          </span>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/account/library"
          className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2.5 rounded-sm transition-colors"
        >
          <Download size={14} />
          View Library
        </Link>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center text-[13px] font-semibold text-steam-text bg-steam-card hover:bg-steam-cardHover border border-steam-borderSubtle px-4 py-2.5 rounded-sm transition-colors"
        >
          Keep Browsing
        </Link>
      </div>

      <p className="text-steam-textDim text-[11px] mt-6 text-center">
        A demo receipt for {justPurchased.length}{' '}
        {justPurchased.length === 1 ? 'item' : 'items'} — no real charge was made.
      </p>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
