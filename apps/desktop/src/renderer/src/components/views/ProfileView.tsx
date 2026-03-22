import { useAtomValue } from 'jotai'
import { currentUserAtom, friendsAtom } from '@renderer/stores/userStore'
import { installedGamesAtom } from '@renderer/stores/libraryStore'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { cn } from '@renderer/lib/utils'

function StatusDot({ isOnline, inGame }: { isOnline: boolean; inGame?: boolean }) {
  return (
    <span className={cn(
      'inline-block w-2 h-2 rounded-full shrink-0',
      inGame ? 'bg-[#a4d007]' : isOnline ? 'bg-steam-online' : 'bg-steam-textDim'
    )} />
  )
}

export function ProfileView() {
  const user = useAtomValue(currentUserAtom)
  const friends = useAtomValue(friendsAtom)
  const installedGames = useAtomValue(installedGamesAtom)

  if (!user) return null

  const onlineFriends = friends.filter(f => f.isOnline)
  const offlineFriends = friends.filter(f => !f.isOnline)
  const totalHours = user.library.reduce((sum, e) => sum + Math.round(e.playtimeMinutes / 60), 0)
  const memberYear = new Date(user.memberSince).getFullYear()

  return (
    <ScrollArea className="h-full">
      <div className="p-5">
        <div className="flex gap-6">
          {/* Left: profile card */}
          <div className="w-[260px] shrink-0 space-y-4">
            <div className="bg-steam-card rounded-sm overflow-hidden">
              {/* Banner */}
              <div className="h-[80px] bg-gradient-to-br from-[#2a475e] to-[#1b2838]" />
              {/* Avatar */}
              <div className="px-4 pb-4">
                <div className="-mt-8 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-sm border-2 border-[#1b2838] object-cover"
                  />
                </div>
                <p className="text-white text-[16px] font-bold">{user.displayName}</p>
                <p className="text-steam-textMuted text-[12px]">{user.username}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatusDot isOnline={user.isOnline} />
                  <span className="text-steam-online text-[11px]">Online</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-steam-card rounded-sm p-3 space-y-2">
              {[
                ['Member since', memberYear.toString()],
                ['Games owned', installedGames.length.toString()],
                ['Hours played', `${totalHours.toLocaleString()} hrs`],
                ['Wallet', `$${(user.wallet.amount / 100).toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[12px]">
                  <span className="text-steam-textMuted">{label}</span>
                  <span className="text-steam-text font-medium">{value}</span>
                </div>
              ))}
            </div>

            <button className="w-full text-[12px] font-semibold text-white border border-steam-borderSubtle hover:border-steam-text py-2 rounded-sm transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Right: friends list */}
          <div className="flex-1 min-w-0">
            <h3 className="text-steam-text text-[13px] font-semibold uppercase tracking-wider mb-3">
              Friends — {friends.length} total
            </h3>

            {onlineFriends.length > 0 && (
              <div className="mb-4">
                <p className="text-steam-textDim text-[10px] uppercase tracking-wider mb-2">Online — {onlineFriends.length}</p>
                <div className="space-y-1">
                  {onlineFriends.map(friend => (
                    <div key={friend.steamId} className="flex items-center gap-3 p-2.5 bg-steam-card hover:bg-steam-cardHover rounded-sm transition-colors">
                      <img src={friend.avatar} alt={friend.displayName} className="w-9 h-9 rounded-sm object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-steam-text text-[13px] font-medium">{friend.displayName}</p>
                        <div className="flex items-center gap-1.5">
                          <StatusDot isOnline={true} />
                          <span className="text-steam-online text-[11px]">Online</span>
                        </div>
                      </div>
                      <button className="text-[11px] text-steam-textMuted hover:text-steam-text border border-steam-borderSubtle px-2.5 py-1 rounded-sm transition-colors shrink-0">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {offlineFriends.length > 0 && (
              <div>
                <p className="text-steam-textDim text-[10px] uppercase tracking-wider mb-2">Offline — {offlineFriends.length}</p>
                <div className="space-y-1">
                  {offlineFriends.map(friend => (
                    <div key={friend.steamId} className="flex items-center gap-3 p-2.5 bg-steam-card hover:bg-steam-cardHover rounded-sm transition-colors opacity-70">
                      <img src={friend.avatar} alt={friend.displayName} className="w-9 h-9 rounded-sm object-cover shrink-0 grayscale" />
                      <div className="flex-1 min-w-0">
                        <p className="text-steam-text text-[13px] font-medium">{friend.displayName}</p>
                        <div className="flex items-center gap-1.5">
                          <StatusDot isOnline={false} />
                          <span className="text-steam-textDim text-[11px]">Offline</span>
                        </div>
                      </div>
                      <button className="text-[11px] text-steam-textMuted hover:text-steam-text border border-steam-borderSubtle px-2.5 py-1 rounded-sm transition-colors shrink-0">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
