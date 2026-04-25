'use client'

import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { LogIn, MapPin, Calendar, Award, Heart, ShoppingCart, Gamepad2 } from 'lucide-react'
import { currentUserAtom } from '@/stores/userStore'
import { purchasesAtom } from '@/stores/purchasesStore'
import { wishlistAtom } from '@/stores/wishlistStore'
import { cartItemsAtom } from '@/stores/cartStore'
import { formatDate } from '@/lib/utils'

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  AU: 'Australia',
  JP: 'Japan',
  KR: 'South Korea',
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  href?: string
}) {
  const inner = (
    <div className="bg-steam-card hover:bg-steam-cardHover transition-colors rounded-sm p-4 flex items-center gap-3">
      <div className="shrink-0 w-9 h-9 rounded-sm bg-steam-blue/15 text-steam-accentPale flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-steam-text text-[18px] font-bold leading-none tabular-nums">{value}</p>
        <p className="text-steam-textMuted text-[11px] uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  )

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  )
}

export default function ProfilePage() {
  const user = useAtomValue(currentUserAtom)
  const purchases = useAtomValue(purchasesAtom)
  const wishlist = useAtomValue(wishlistAtom)
  const cart = useAtomValue(cartItemsAtom)

  if (!user) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-steam-blue/15 mb-3">
          <LogIn size={22} className="text-steam-accentPale" />
        </div>
        <h1 className="text-steam-text text-[22px] font-semibold mb-2">
          Sign in to view your profile
        </h1>
        <p className="text-steam-textMuted text-[13px] mb-5 max-w-[420px] mx-auto">
          Your library, wishlist, and friends list show up here once you sign in to Steam.
        </p>
        <Link
          href="/login"
          className="inline-block text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-5 py-2 rounded-sm transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const totalPlaytime = user.library.reduce((sum, e) => sum + e.playtimeMinutes, 0)
  const playtimeHours = Math.round(totalPlaytime / 60)
  const totalAchievements = user.library.reduce(
    (sum, e) => sum + e.achievements.unlocked,
    0
  )

  const recentlyPlayed = [...user.library]
    .filter((e) => e.lastPlayedAt)
    .sort((a, b) => Date.parse(b.lastPlayedAt!) - Date.parse(a.lastPlayedAt!))
    .slice(0, 3)

  const country = COUNTRY_NAMES[user.countryCode] ?? user.countryCode

  return (
    <div className="max-w-[940px] mx-auto px-4 sm:px-0 py-6">
      {/* Header card */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45] border border-[#2a5a7a]/60 rounded-sm p-5 mb-6 flex items-center gap-5"
      >
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-20 h-20 rounded-sm object-cover ring-2 ring-steam-blue"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0d2d45] ${
              user.isOnline ? 'bg-steam-online' : 'bg-steam-textDim'
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-white text-[24px] font-semibold leading-tight">
            {user.displayName}
          </h1>
          <p className="text-steam-accentPale text-[12px] mt-0.5">
            {user.isOnline ? 'Online' : 'Offline'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[12px] text-steam-text">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-steam-textMuted" />
              {country}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-steam-textMuted" />
              Member since {formatDate(user.memberSince)}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        <StatCard
          icon={<Gamepad2 size={16} />}
          label="Games Owned"
          value={purchases.length || user.library.length}
          href="/account/library"
        />
        <StatCard
          icon={<Heart size={16} />}
          label="Wishlist"
          value={wishlist.length}
          href="/wishlist"
        />
        <StatCard
          icon={<ShoppingCart size={16} />}
          label="In Cart"
          value={cart.length}
          href="/cart"
        />
        <StatCard
          icon={<Award size={16} />}
          label="Achievements"
          value={totalAchievements}
        />
      </section>

      {/* Recently played */}
      <section className="mb-8">
        <h2 className="text-steam-text text-[16px] font-semibold mb-3 pb-2 border-b border-steam-borderSubtle">
          Recently Played
        </h2>
        {recentlyPlayed.length === 0 ? (
          <p className="text-steam-textMuted text-[13px] py-4">No recent activity.</p>
        ) : (
          <ul className="space-y-2">
            {recentlyPlayed.map((entry, i) => {
              const hours = Math.round(entry.playtimeMinutes / 60)
              const pct = Math.round(
                (entry.achievements.unlocked / Math.max(entry.achievements.total, 1)) * 100
              )
              return (
                <motion.li
                  key={entry.gameId}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.22 }}
                  className="flex items-center gap-3 bg-steam-card hover:bg-steam-cardHover transition-colors rounded-sm p-3"
                >
                  <div className="shrink-0 w-12 h-12 rounded-sm bg-steam-blue/15 flex items-center justify-center text-steam-accentPale text-[10px] font-bold tabular-nums">
                    #{entry.gameId}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-steam-text text-[13px] font-semibold leading-tight">
                      Game {entry.gameId}
                    </p>
                    <p className="text-steam-textMuted text-[11px] mt-0.5">
                      {hours} hrs · last played {formatDate(entry.lastPlayedAt!)} · {pct}%
                      achievements
                    </p>
                  </div>
                  <div className="shrink-0 w-24 h-1 rounded-full bg-steam-borderSubtle overflow-hidden">
                    <div
                      className="h-full bg-steam-blue"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Wallet */}
      <section className="bg-steam-card rounded-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-steam-textDim text-[11px] uppercase tracking-wider">
            Steam Wallet
          </p>
          <p className="text-steam-text text-[20px] font-bold tabular-nums mt-0.5">
            ${(user.wallet.amount / 100).toFixed(2)}
          </p>
          <p className="text-steam-textMuted text-[11px]">
            Total play time: {playtimeHours.toLocaleString()} hrs
          </p>
        </div>
        <Link
          href="/points"
          className="text-[12px] font-semibold text-steam-text bg-steam-bg hover:bg-[#1e3346] border border-steam-borderSubtle px-4 py-2 rounded-sm transition-colors"
        >
          Add Funds
        </Link>
      </section>
    </div>
  )
}
