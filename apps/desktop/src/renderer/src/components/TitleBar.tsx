import { useAtomValue } from 'jotai'
import { Minus, Square, X } from 'lucide-react'
import { titleBarTitleAtom } from '@renderer/stores/uiStore'
import { cn } from '@renderer/lib/utils'

const isMac = window.electronAPI?.platform === 'darwin'

export function TitleBar() {
  const title = useAtomValue(titleBarTitleAtom)

  return (
    <div
      className="flex items-center h-8 bg-[#0e1318] select-none shrink-0 border-b border-black/50"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: Steam logo */}
      <div className="flex items-center gap-2 px-3 w-[200px]">
        <div className="h-4 w-4 rounded-full bg-steam-blue/20 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-steam-blue" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-steam-textMuted uppercase">
          Steam
        </span>
      </div>

      {/* Center: title */}
      <div className="flex-1 text-center">
        <span className="text-[11px] text-steam-textMuted truncate">{title}</span>
      </div>

      {/* Right: window controls (hidden on macOS — native traffic lights handle it) */}
      <div
        className={cn('flex items-center w-[200px] justify-end', isMac && 'invisible')}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => window.electronAPI?.minimize()}
          className="h-8 w-11 flex items-center justify-center text-steam-textMuted hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Minimize"
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => window.electronAPI?.maximize()}
          className="h-8 w-11 flex items-center justify-center text-steam-textMuted hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Maximize"
        >
          <Square size={10} />
        </button>
        <button
          onClick={() => window.electronAPI?.close()}
          className="h-8 w-11 flex items-center justify-center text-steam-textMuted hover:text-white hover:bg-red-600 transition-colors"
          aria-label="Close"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
