import { useAtom } from 'jotai'
import { Pause, Play, X, Download } from 'lucide-react'
import { downloadQueueAtom, type DownloadItem } from '@renderer/stores/libraryStore'
import { Progress } from '@renderer/components/ui/progress'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

function DownloadRow({ item, onToggle, onRemove }: { item: DownloadItem; onToggle: () => void; onRemove: () => void }) {
  const isActive = item.status === 'downloading'
  const isPaused = item.status === 'paused'

  return (
    <div className="p-4 border-b border-steam-borderSubtle">
      <div className="flex items-center gap-3 mb-2">
        <img src={item.game.headerImage} alt={item.game.title} className="w-16 h-16 object-cover rounded-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-steam-text text-[14px] font-semibold leading-tight truncate">{item.game.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                onClick={onToggle}
                className="text-steam-textMuted hover:text-white transition-colors p-1 h-auto"
                aria-label={isActive ? 'Pause' : 'Resume'}
              >
                {isActive ? <Pause size={14} /> : <Play size={14} />}
              </Button>
              <Button
                variant="ghost"
                onClick={onRemove}
                className="text-steam-textMuted hover:text-[#c34741] transition-colors p-1 h-auto"
                aria-label="Remove"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1 text-[11px] text-steam-textMuted">
            <span className={cn(
              'font-medium',
              isActive && 'text-steam-blue',
              isPaused && 'text-[#b9a074]',
              item.status === 'queued' && 'text-steam-textDim'
            )}>
              {item.status === 'downloading' ? 'Downloading' : item.status === 'paused' ? 'Paused' : 'Queued'}
            </span>
            {isActive && <><span>·</span><span>{item.speed}</span><span>·</span><span>{item.eta} remaining</span></>}
            <span>·</span>
            <span>{item.sizeGb} GB</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Progress
          value={item.progress}
          className={cn('flex-1 h-1.5', isActive ? 'bg-steam-card' : 'bg-steam-card opacity-50')}
        />
        <span className="text-steam-textDim text-[11px] w-8 text-right shrink-0">{item.progress}%</span>
      </div>
    </div>
  )
}

export function DownloadsView() {
  const [queue, setQueue] = useAtom(downloadQueueAtom)

  function toggleItem(idx: number) {
    setQueue(q => q.map((item, i) => i !== idx ? item : {
      ...item,
      status: item.status === 'downloading' ? 'paused' : 'downloading',
      speed: item.status === 'downloading' ? '0 MB/s' : '18.4 MB/s',
    }))
  }

  function removeItem(idx: number) {
    setQueue(q => q.filter((_, i) => i !== idx))
  }

  const active = queue.filter(i => i.status === 'downloading')
  const rest = queue.filter(i => i.status !== 'downloading')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-steam-borderSubtle flex items-center justify-between shrink-0">
        <h2 className="text-steam-text text-[16px] font-semibold flex items-center gap-2">
          <Download size={16} className="text-steam-blue" />
          Downloads
        </h2>
        <p className="text-steam-textMuted text-[12px]">{queue.length} items</p>
      </div>

      <ScrollArea className="flex-1">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Download size={32} className="text-steam-textDim mb-3" />
            <p className="text-steam-textMuted text-[14px]">No downloads</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div>
                <p className="text-steam-textDim text-[10px] uppercase tracking-wider px-5 py-2">Active</p>
                {active.map((item, i) => {
                  const realIdx = queue.indexOf(item)
                  return <DownloadRow key={item.game.id} item={item} onToggle={() => toggleItem(realIdx)} onRemove={() => removeItem(realIdx)} />
                })}
              </div>
            )}
            {rest.length > 0 && (
              <div>
                <p className="text-steam-textDim text-[10px] uppercase tracking-wider px-5 py-2 mt-2">Queue</p>
                {rest.map(item => {
                  const realIdx = queue.indexOf(item)
                  return <DownloadRow key={item.game.id} item={item} onToggle={() => toggleItem(realIdx)} onRemove={() => removeItem(realIdx)} />
                })}
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </div>
  )
}
