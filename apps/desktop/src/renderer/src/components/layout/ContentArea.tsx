import { useAtomValue } from 'jotai'
import { activeTabAtom } from '@renderer/stores/uiStore'
import { StoreView } from '@renderer/components/views/StoreView'
import { LibraryView } from '@renderer/components/views/LibraryView'
import { CommunityView } from '@renderer/components/views/CommunityView'
import { DownloadsView } from '@renderer/components/views/DownloadsView'
import { ProfileView } from '@renderer/components/views/ProfileView'
import { SettingsView } from '@renderer/components/views/SettingsView'
import { GameLaunchScreen } from '@renderer/components/views/GameLaunchScreen'

export function ContentArea() {
  const activeTab = useAtomValue(activeTabAtom)

  return (
    <div className="flex-1 min-w-0 h-full overflow-hidden relative">
      {activeTab === 'store' && <StoreView />}
      {activeTab === 'library' && <LibraryView />}
      {activeTab === 'community' && <CommunityView />}
      {activeTab === 'downloads' && <DownloadsView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'settings' && <SettingsView />}
      <GameLaunchScreen />
    </div>
  )
}
