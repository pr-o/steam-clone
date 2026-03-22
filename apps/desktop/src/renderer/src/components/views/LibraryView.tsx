import { useAtom, useAtomValue } from 'jotai'
import { Play, Star } from 'lucide-react'
import { activeSidebarGameAtom } from '@renderer/stores/uiStore'
import { installedGamesAtom, currentlyPlayingAtom } from '@renderer/stores/libraryStore'
import { currentUserAtom } from '@renderer/stores/userStore'
import { Progress } from '@renderer/components/ui/progress'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { cn } from '@renderer/lib/utils'
import type { Game } from '@steam-clone/types'

function formatHours(minutes: number) {
  const h = Math.round(minutes / 60)
  return `${h.toLocaleString()} hrs`
}

function GameDetailPanel({ game }: { game: Game }) {
  const [, setPlaying] = useAtom(currentlyPlayingAtom)
  const currentUser = useAtomValue(currentUserAtom)
  const entry = currentUser?.library.find(l => l.gameId === game.id)
  const hours = entry ? Math.round(entry.playtimeMinutes / 60) : 0
  const achievements = entry?.achievements

  return (
    <div className="flex flex-col h-full">
      {/* Hero banner */}
      <div className="relative h-[220px] shrink-0 overflow-hidden">
        <img src={game.headerImage} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-[#1b2838]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
          <div>
            <h2 className="text-white text-[22px] font-bold leading-tight">{game.title}</h2>
            <p className="text-steam-textMuted text-[12px] mt-0.5">{formatHours(entry?.playtimeMinutes ?? 0)} on record</p>
          </div>
          <button
            onClick={() => setPlaying(game)}
            className="flex items-center gap-2 bg-[#5c7e10] hover:bg-[#6b9313] text-white font-bold text-[14px] px-6 py-2.5 rounded-sm transition-colors"
          >
            <Play size={16} className="fill-white" />
            PLAY
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          {/* Achievements */}
          {achievements && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-steam-text text-[13px] font-semibold flex items-center gap-1.5">
                  <Star size={13} className="text-steam-blue" />
                  Achievements
                </p>
                <p className="text-steam-textMuted text-[12px]">
                  {achievements.unlocked} / {achievements.total}
                </p>
              </div>
              <Progress
                value={(achievements.unlocked / achievements.total) * 100}
                className="h-2 bg-steam-card"
              />
              <p className="text-steam-textDim text-[11px] mt-1">
                {Math.round((achievements.unlocked / achievements.total) * 100)}% complete
              </p>
            </div>
          )}

          {/* Recent activity */}
          <div>
            <p className="text-steam-text text-[13px] font-semibold mb-3">Recent Activity</p>
            <div className="space-y-2">
              {entry?.lastPlayedAt && (
                <div className="bg-steam-card rounded-sm p-3 flex items-center gap-3">
                  <img src={game.headerImage} alt="" className="w-12 h-12 object-cover rounded-sm" />
                  <div>
                    <p className="text-steam-text text-[12px] font-medium">{game.title}</p>
                    <p className="text-steam-textMuted text-[11px]">
                      {hours} hrs total · Last played {new Date(entry.lastPlayedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-steam-card rounded-sm p-3">
                <p className="text-steam-textMuted text-[11px]">
                  {achievements ? `${achievements.unlocked} achievements earned — ${Math.round((achievements.unlocked / achievements.total) * 100)}% of all achievements` : 'No achievement data'}
                </p>
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <p className="text-steam-text text-[13px] font-semibold mb-3">Screenshots</p>
            <div className="grid grid-cols-3 gap-1.5">
              {game.screenshots.slice(0, 3).map((src, i) => (
                <div key={i} className="overflow-hidden rounded-sm">
                  <img src={src} alt="" className="w-full h-[72px] object-cover hover:scale-105 transition-transform duration-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Community hub */}
          <button className="w-full text-[12px] text-steam-link hover:text-steam-linkHover border border-steam-borderSubtle hover:border-steam-link py-2 rounded-sm transition-colors">
            View Community Hub
          </button>
        </div>
      </ScrollArea>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <img src="https://placehold.co/80x80/1b2838/4a7a9b?text=🎮" alt="" className="w-16 h-16 rounded-sm mb-4 opacity-50" />
      <p className="text-steam-textMuted text-[14px]">Select a game from your library</p>
    </div>
  )
}

export function LibraryView() {
  const [selectedGame, setSelectedGame] = useAtom(activeSidebarGameAtom)
  const installedGames = useAtomValue(installedGamesAtom)

  // Auto-select first game
  const displayGame = selectedGame ?? installedGames[0] ?? null

  return (
    <div className="flex h-full">
      {/* Left pane: compact game list */}
      <div className="w-[220px] shrink-0 border-r border-black/40 flex flex-col">
        <p className="text-steam-textDim text-[10px] uppercase tracking-wider px-3 py-2">
          {installedGames.length} games
        </p>
        <ScrollArea className="flex-1">
          {installedGames.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                displayGame?.id === game.id ? 'bg-[#2a4a6e]' : 'hover:bg-[#1b2838]'
              )}
            >
              <img src={game.headerImage} alt="" className="w-10 h-10 object-cover rounded-sm shrink-0" />
              <div className="min-w-0">
                <p className="text-steam-text text-[12px] font-medium truncate leading-tight">{game.title}</p>
                <p className="text-steam-textDim text-[10px] mt-0.5">{game.developer}</p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Right pane: game detail */}
      <div className="flex-1 min-w-0">
        {displayGame ? <GameDetailPanel game={displayGame} /> : <EmptyState />}
      </div>
    </div>
  )
}
