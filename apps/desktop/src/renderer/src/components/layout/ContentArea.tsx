import { useAtomValue } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'
import { activeTabAtom } from '@renderer/stores/uiStore'
import { StoreView } from '@renderer/components/views/StoreView'
import { LibraryView } from '@renderer/components/views/LibraryView'
import { CommunityView } from '@renderer/components/views/CommunityView'
import { DownloadsView } from '@renderer/components/views/DownloadsView'
import { ProfileView } from '@renderer/components/views/ProfileView'
import { SettingsView } from '@renderer/components/views/SettingsView'
import { GameLaunchScreen } from '@renderer/components/views/GameLaunchScreen'

const VIEWS = {
  store: StoreView,
  library: LibraryView,
  community: CommunityView,
  downloads: DownloadsView,
  profile: ProfileView,
  settings: SettingsView,
} as const

export function ContentArea() {
  const activeTab = useAtomValue(activeTabAtom)
  const ActiveView = VIEWS[activeTab]

  return (
    <div className="flex-1 min-w-0 h-full overflow-hidden relative">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 overflow-y-auto will-change-[transform,opacity]"
        >
          <ActiveView />
        </motion.div>
      </AnimatePresence>
      <GameLaunchScreen />
    </div>
  )
}
