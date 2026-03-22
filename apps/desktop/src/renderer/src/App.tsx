import { TitleBar } from '@renderer/components/TitleBar'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { ContentArea } from '@renderer/components/layout/ContentArea'

function App() {
  return (
    <div className="flex flex-col h-screen bg-steam-bg overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ContentArea />
      </div>
    </div>
  )
}

export default App
