'use client'

import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { Download, Clock } from 'lucide-react'
import { purchasesAtom } from '@/stores/purchasesStore'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { formatDate, formatPrice } from '@/lib/utils'

export default function LibraryPage() {
  const isSignedIn = useRequireAuth()
  const purchases = useAtomValue(purchasesAtom)
  if (!isSignedIn) return null
  const sorted = [...purchases].sort(
    (a, b) => Date.parse(b.purchasedAt) - Date.parse(a.purchasedAt)
  )

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-steam-text text-[22px] font-semibold">Your Library</h1>
        <p className="text-steam-textMuted text-[12px]">
          {purchases.length} {purchases.length === 1 ? 'game' : 'games'} owned
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-steam-card rounded-sm p-8 text-center">
          <p className="text-steam-text text-[14px] mb-1">Your library is empty.</p>
          <p className="text-steam-textMuted text-[12px] mb-4">
            Games you purchase from the store will show up here.
          </p>
          <Link
            href="/"
            className="inline-block text-[13px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors"
          >
            Browse the Store
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map((p, i) => (
            <motion.li
              key={p.gameId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
              className="bg-steam-card hover:bg-steam-cardHover rounded-sm overflow-hidden flex items-stretch transition-colors"
            >
              <Link href={`/app/${p.gameId}/${p.game.slug}`} className="shrink-0">
                <img
                  src={p.game.headerImage}
                  alt={p.game.title}
                  className="w-[184px] h-[86px] object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/app/${p.gameId}/${p.game.slug}`}
                    className="text-steam-text text-[14px] font-semibold hover:text-steam-link transition-colors line-clamp-1 block"
                  >
                    {p.game.title}
                  </Link>
                  <p className="text-steam-textMuted text-[11px] flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    Acquired {formatDate(p.purchasedAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-steam-textDim text-[11px]">
                    {p.totalPaid > 0 ? `Paid ${formatPrice(p.totalPaid)}` : 'Free'}
                  </span>
                  <button
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-3 py-1 rounded-sm transition-colors"
                    type="button"
                  >
                    <Download size={11} /> Install
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
