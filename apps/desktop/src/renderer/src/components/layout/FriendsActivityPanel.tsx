import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Trophy, Play, Heart, ShoppingCart } from 'lucide-react'
import { friendsAtom } from '@renderer/stores/userStore'
import { activityFeedAtom, type ActivityEvent } from '@renderer/stores/activityStore'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - Date.parse(iso))
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function ActivityIcon({ kind }: { kind: ActivityEvent['kind'] }) {
  const cls = 'shrink-0'
  switch (kind) {
    case 'started_playing':
      return <Play size={11} className={cn(cls, 'text-steam-online')} fill="currentColor" />
    case 'achievement':
      return <Trophy size={11} className={cn(cls, 'text-[#a4d007]')} />
    case 'wishlist_add':
      return <Heart size={11} className={cn(cls, 'text-steam-accentPale')} fill="currentColor" />
    case 'purchased':
      return <ShoppingCart size={11} className={cn(cls, 'text-steam-blue')} />
  }
}

function activityText(ev: ActivityEvent): React.ReactNode {
  switch (ev.kind) {
    case 'started_playing':
      return (
        <>
          started playing <span className="text-steam-text">{ev.game.title}</span>
        </>
      )
    case 'achievement':
      return (
        <>
          unlocked{' '}
          <span className="text-[#a4d007]">{ev.achievementName ?? 'an achievement'}</span> in{' '}
          <span className="text-steam-text">{ev.game.title}</span>
        </>
      )
    case 'wishlist_add':
      return (
        <>
          added <span className="text-steam-text">{ev.game.title}</span> to their wishlist
        </>
      )
    case 'purchased':
      return (
        <>
          purchased <span className="text-steam-text">{ev.game.title}</span>
        </>
      )
  }
}

export function FriendsActivityPanel() {
  const friends = useAtomValue(friendsAtom)
  const activity = useAtomValue(activityFeedAtom)
  const [section, setSection] = useState<'friends' | 'activity'>('friends')
  const [open, setOpen] = useState(true)

  const sortedFriends = [...friends].sort((a, b) => {
    if (a.isOnline === b.isOnline) {
      // In-game first, then by name
      const aPlaying = a.currentGame ? 0 : 1
      const bPlaying = b.currentGame ? 0 : 1
      if (aPlaying !== bPlaying) return aPlaying - bPlaying
      return a.displayName.localeCompare(b.displayName)
    }
    return a.isOnline ? -1 : 1
  })

  const onlineCount = friends.filter((f) => f.isOnline).length

  return (
    <div className="flex flex-col flex-1 min-h-0 border-t border-black/30">
      <Button
        variant="ghost"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-3 py-2 h-auto rounded-none hover:bg-white/5 transition-colors"
      >
        <span className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-steam-textMuted">
            Friends
          </span>
          <span className="text-[10px] text-steam-online">{onlineCount} online</span>
        </span>
        <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={12} className="text-steam-textMuted" />
        </motion.span>
      </Button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Section toggle */}
            <div className="flex items-center px-2 pb-1 gap-1 relative">
              {(['friends', 'activity'] as const).map((s) => (
                <Button
                  key={s}
                  variant="ghost"
                  onClick={() => setSection(s)}
                  className={cn(
                    'relative flex-1 h-7 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-colors',
                    section === s ? 'text-white' : 'text-steam-textDim hover:text-steam-text'
                  )}
                >
                  {section === s && (
                    <motion.span
                      layoutId="friends-tab-pill"
                      className="absolute inset-0 bg-[#1b2838] rounded-sm"
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  <span className="relative">{s === 'friends' ? 'Friends' : 'Activity'}</span>
                </Button>
              ))}
            </div>

            <ScrollArea className="flex-1 min-h-0 max-h-[280px]">
              <AnimatePresence mode="wait" initial={false}>
                {section === 'friends' ? (
                  <motion.ul
                    key="friends"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.18 }}
                    className="px-1 pb-2"
                  >
                    {sortedFriends.map((f) => (
                      <li
                        key={f.steamId}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-[#1b2838] transition-colors cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={f.avatar}
                            alt={f.displayName}
                            className={cn(
                              'w-7 h-7 rounded-sm object-cover transition-opacity',
                              !f.isOnline && 'opacity-50 grayscale'
                            )}
                          />
                          <span
                            className={cn(
                              'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-steam-bg',
                              f.currentGame
                                ? 'bg-steam-online'
                                : f.isOnline
                                  ? 'bg-steam-blue'
                                  : 'bg-steam-textDim'
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'text-[11px] truncate leading-tight',
                              f.isOnline ? 'text-steam-text' : 'text-steam-textDim'
                            )}
                          >
                            {f.displayName}
                          </p>
                          <p
                            className={cn(
                              'text-[10px] truncate leading-tight',
                              f.currentGame ? 'text-steam-online' : 'text-steam-textDim'
                            )}
                          >
                            {f.currentGame
                              ? `In-Game · ${f.currentGame.title}`
                              : f.isOnline
                                ? 'Online'
                                : 'Offline'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.ul
                    key="activity"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className="px-2 pb-2 flex flex-col gap-2"
                  >
                    {activity.map((ev) => (
                      <li key={ev.id} className="flex items-start gap-2">
                        <img
                          src={ev.user.avatar}
                          alt={ev.user.displayName}
                          className="w-7 h-7 rounded-sm object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] leading-snug text-steam-textMuted">
                            <span className="text-steam-text font-medium">
                              {ev.user.displayName}
                            </span>{' '}
                            {activityText(ev)}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-steam-textDim">
                            <ActivityIcon kind={ev.kind} />
                            <span>{timeAgo(ev.at)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
