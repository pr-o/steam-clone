import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Store, BookOpen, Users, Settings, Search } from 'lucide-react'
import { activeTabAtom, activeSidebarGameAtom, type AppTab } from '@renderer/stores/uiStore'
import { currentUserAtom, friendsAtom } from '@renderer/stores/userStore'
import { installedGamesAtom } from '@renderer/stores/libraryStore'
import { cn } from '@renderer/lib/utils'

const NAV_ITEMS: { tab: AppTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { tab: 'store', label: 'STORE', icon: Store },
  { tab: 'library', label: 'LIBRARY', icon: BookOpen },
  { tab: 'community', label: 'COMMUNITY', icon: Users },
]

export function Sidebar() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  const [, setActiveSidebarGame] = useAtom(activeSidebarGameAtom)
  const currentUser = useAtomValue(currentUserAtom)
  const friends = useAtomValue(friendsAtom)
  const installedGames = useAtomValue(installedGamesAtom)
  const [librarySearch, setLibrarySearch] = useState('')

  const onlineFriends = friends.filter(f => f.isOnline).length

  const filteredGames = installedGames.filter(g =>
    g.title.toLowerCase().includes(librarySearch.toLowerCase())
  )

  return (
    <aside className="flex flex-col w-[220px] h-full bg-steam-bg border-r border-black/40 shrink-0">
      {/* Primary nav */}
      <nav className="flex flex-col pt-1">
        {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-3 h-10 px-4 text-[12px] font-semibold tracking-[0.08em] transition-colors relative',
              activeTab === tab
                ? 'text-white bg-[#1b2838]'
                : 'text-steam-textMuted hover:text-steam-text hover:bg-white/5'
            )}
          >
            {activeTab === tab && (
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-steam-blue" />
            )}
            <Icon size={15} className={activeTab === tab ? 'text-steam-blue' : ''} />
            {label}
          </button>
        ))}
      </nav>

      {/* Library game list (only when library tab active) */}
      {activeTab === 'library' && (
        <div className="flex flex-col flex-1 overflow-hidden border-t border-black/30 mt-1 pt-2">
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 bg-[#1b2838] rounded px-2 py-1.5">
              <Search size={12} className="text-steam-textMuted shrink-0" />
              <input
                type="text"
                value={librarySearch}
                onChange={e => setLibrarySearch(e.target.value)}
                placeholder="Search games..."
                className="flex-1 text-[11px] bg-transparent text-steam-text placeholder:text-steam-textDim outline-none"
              />
            </div>
          </div>

          {/* Game list */}
          <div className="flex-1 overflow-y-auto">
            {filteredGames.length === 0 ? (
              <p className="px-4 py-3 text-[11px] text-steam-textDim">
                {installedGames.length === 0
                  ? 'No games installed'
                  : 'No results'}
              </p>
            ) : (
              filteredGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => setActiveSidebarGame(game)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1b2838] transition-colors text-left"
                >
                  <img
                    src={game.headerImage}
                    alt={game.title}
                    className="w-8 h-8 object-cover rounded-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] text-steam-text truncate">{game.title}</p>
                    <p className="text-[10px] text-steam-textDim">
                      {Math.floor(game.playerCount ?? 0 / 60)}h played
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User section */}
      <div className="border-t border-black/40 p-3 flex items-center gap-2">
        {currentUser && (
          <>
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-medium truncate">
                {currentUser.displayName}
              </p>
              <p className="text-[10px] text-steam-online">
                {onlineFriends} friends online
              </p>
            </div>
            <button
              className="text-steam-textMuted hover:text-white transition-colors shrink-0"
              aria-label="Settings"
            >
              <Settings size={14} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
