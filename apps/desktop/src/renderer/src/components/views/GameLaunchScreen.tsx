import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { currentlyPlayingAtom } from '@renderer/stores/libraryStore'
import { Button } from '@renderer/components/ui/button'

export function GameLaunchScreen() {
  const [game, setGame] = useAtom(currentlyPlayingAtom)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!game) return
    // Animate dots
    const dotsTimer = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    // Auto-dismiss after 3 s
    const dismissTimer = setTimeout(() => setGame(null), 3000)
    return () => { clearInterval(dotsTimer); clearTimeout(dismissTimer) }
  }, [game, setGame])

  if (!game) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Blurred game art background */}
      <div className="absolute inset-0">
        <img src={game.headerImage} alt="" className="w-full h-full object-cover scale-110 blur-md" />
        <div className="absolute inset-0 bg-[#1b2838]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Game art */}
        <div className="w-[300px] h-[140px] overflow-hidden rounded-sm mb-8 shadow-2xl">
          <img src={game.headerImage} alt={game.title} className="w-full h-full object-cover" />
        </div>

        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-steam-blue/30 border-t-steam-blue rounded-full animate-spin mb-6" />

        <p className="text-white text-[18px] font-semibold mb-1">
          Launching {game.title}{dots}
        </p>
        <p className="text-steam-textMuted text-[13px]">Preparing your game</p>

        <Button
          variant="ghost"
          onClick={() => setGame(null)}
          className="mt-8 text-[12px] text-steam-textMuted hover:text-white border border-steam-borderSubtle hover:border-steam-text px-4 py-1.5 h-auto rounded-sm transition-colors"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
