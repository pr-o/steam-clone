import { useAtomValue } from 'jotai'
import { activeTabAtom } from '@renderer/stores/uiStore'
import { ScrollArea } from '@renderer/components/ui/scroll-area'

function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-steam-textMuted text-sm">{label} — coming soon</p>
    </div>
  )
}

export function ContentArea() {
  const activeTab = useAtomValue(activeTabAtom)

  return (
    <div className="flex-1 min-w-0 h-full overflow-hidden">
      <ScrollArea className="h-full">
        {activeTab === 'store' && <PlaceholderView label="Store" />}
        {activeTab === 'library' && <PlaceholderView label="Library" />}
        {activeTab === 'community' && <PlaceholderView label="Community" />}
      </ScrollArea>
    </div>
  )
}
