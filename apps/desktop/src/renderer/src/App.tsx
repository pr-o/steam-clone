import { useAtomValue } from 'jotai'
import { TitleBar } from '@renderer/components/TitleBar'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { ContentArea } from '@renderer/components/layout/ContentArea'
import { SignInScreen } from '@renderer/components/SignInScreen'
import { isSignedInAtom } from '@renderer/stores/userStore'

function App() {
  const isSignedIn = useAtomValue(isSignedInAtom)

  return (
    <div className="flex flex-col h-screen bg-steam-bg overflow-hidden">
      <TitleBar />
      {isSignedIn ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ContentArea />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <SignInScreen />
        </div>
      )}
    </div>
  )
}

export default App
