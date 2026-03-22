import { useState } from 'react'
import { Switch } from '@renderer/components/ui/switch'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@renderer/components/ui/select'
import { cn } from '@renderer/lib/utils'

function ToggleRow({ label, description, checked, onCheckedChange }: {
  label: string; description?: string; checked: boolean; onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-steam-borderSubtle last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-steam-text text-[13px]">{label}</p>
        {description && <p className="text-steam-textMuted text-[11px] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0 mt-0.5" />
    </div>
  )
}

function SelectRow({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-steam-borderSubtle last:border-0">
      <p className="text-steam-text text-[13px]">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-2 py-1 h-auto outline-none focus:ring-steam-blue cursor-pointer w-auto min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SettingsView() {
  // Interface
  const [language, setLanguage] = useState('English')
  const [showFps, setShowFps] = useState(false)
  const [smoothScrolling, setSmoothScrolling] = useState(true)
  const [animations, setAnimations] = useState(true)

  // Downloads
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [downloadWhilePlaying, setDownloadWhilePlaying] = useState(false)
  const [throttle, setThrottle] = useState('No limit')

  // In-Game
  const [overlay, setOverlay] = useState(true)
  const [fpsCounter, setFpsCounter] = useState(false)
  const [screenshot, setScreenshot] = useState(true)
  const [fpsPosition, setFpsPosition] = useState('Top-left')

  // Notifications
  const [friendRequests, setFriendRequests] = useState(true)
  const [gameUpdates, setGameUpdates] = useState(true)
  const [specialOffers, setSpecialOffers] = useState(false)
  const [chatMessages, setChatMessages] = useState(true)

  return (
    <Tabs defaultValue="interface" orientation="vertical" className="flex h-full">
      {/* Sidebar */}
      <TabsList className="w-[180px] shrink-0 border-r border-black/40 pt-4 flex flex-col h-full bg-transparent rounded-none justify-start items-stretch gap-0 p-0">
        {(['interface', 'account', 'downloads', 'ingame', 'notifications'] as const).map(id => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'w-full text-left px-4 py-2.5 text-[13px] transition-colors relative justify-start rounded-none',
              'data-[state=active]:text-white data-[state=active]:bg-[#1b2838]',
              'data-[state=inactive]:text-steam-textMuted data-[state=inactive]:hover:text-steam-text data-[state=inactive]:hover:bg-white/5',
              'data-[state=active]:shadow-none'
            )}
          >
            {id === 'interface' && 'Interface'}
            {id === 'account' && 'Account'}
            {id === 'downloads' && 'Downloads'}
            {id === 'ingame' && 'In-Game'}
            {id === 'notifications' && 'Notifications'}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-[600px]">
          <TabsContent value="interface" className="mt-0">
            <h2 className="text-white text-[18px] font-semibold mb-5">Interface</h2>
            <SelectRow label="Language" value={language} options={['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese (Simplified)']} onChange={setLanguage} />
            <ToggleRow label="Enable smooth scrolling" checked={smoothScrolling} onCheckedChange={setSmoothScrolling} />
            <ToggleRow label="Enable animations" description="Disabling may improve performance on slower machines." checked={animations} onCheckedChange={setAnimations} />
            <ToggleRow label="Display FPS counter in-game" checked={showFps} onCheckedChange={setShowFps} />
            <div className="py-3 border-b border-steam-borderSubtle">
              <p className="text-steam-text text-[13px] mb-1">Skin / Theme</p>
              <p className="text-steam-textMuted text-[12px]">Steam Dark (default) — no other themes available.</p>
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <h2 className="text-white text-[18px] font-semibold mb-5">Account</h2>
            <div className="py-3 border-b border-steam-borderSubtle">
              <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Display Name</p>
              <Input
                defaultValue="SteamUser"
                className="w-full bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
              />
            </div>
            <div className="py-3 border-b border-steam-borderSubtle">
              <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Email Address</p>
              <Input
                defaultValue="user@example.com"
                type="email"
                className="w-full bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
              />
            </div>
            <div className="py-3">
              <Button
                variant="ghost"
                className="text-[12px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 h-auto rounded-sm transition-colors"
              >
                Change Password
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-0">
            <h2 className="text-white text-[18px] font-semibold mb-5">Downloads</h2>
            <div className="py-3 border-b border-steam-borderSubtle">
              <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Default Install Folder</p>
              <div className="flex gap-2">
                <Input
                  defaultValue="C:\\Program Files (x86)\\Steam"
                  className="flex-1 bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
                  readOnly
                />
                <Button
                  variant="ghost"
                  className="text-[12px] text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-3 py-2 h-auto rounded-sm transition-colors shrink-0"
                >
                  Browse
                </Button>
              </div>
            </div>
            <ToggleRow label="Keep games up to date automatically" checked={autoUpdate} onCheckedChange={setAutoUpdate} />
            <ToggleRow label="Allow downloads during gameplay" description="Enabling this may affect game performance." checked={downloadWhilePlaying} onCheckedChange={setDownloadWhilePlaying} />
            <SelectRow label="Bandwidth limit" value={throttle} options={['No limit', '1 MB/s', '5 MB/s', '10 MB/s', '25 MB/s', '50 MB/s']} onChange={setThrottle} />
          </TabsContent>

          <TabsContent value="ingame" className="mt-0">
            <h2 className="text-white text-[18px] font-semibold mb-5">In-Game</h2>
            <ToggleRow label="Enable the Steam Overlay while in-game" checked={overlay} onCheckedChange={setOverlay} />
            <ToggleRow label="Display FPS counter" description="Shows a frames-per-second counter in the top-left corner." checked={fpsCounter} onCheckedChange={setFpsCounter} />
            <ToggleRow label="Screenshot shortcut (F12)" checked={screenshot} onCheckedChange={setScreenshot} />
            <div className="py-3 border-b border-steam-borderSubtle">
              <p className="text-steam-text text-[13px] mb-1">FPS counter position</p>
              <Select
                disabled={!fpsCounter}
                value={fpsPosition}
                onValueChange={setFpsPosition}
              >
                <SelectTrigger className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-2 py-1 h-auto outline-none focus:ring-steam-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed w-auto min-w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right'].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <h2 className="text-white text-[18px] font-semibold mb-5">Notifications</h2>
            <ToggleRow label="Friend requests" checked={friendRequests} onCheckedChange={setFriendRequests} />
            <ToggleRow label="Game updates available" checked={gameUpdates} onCheckedChange={setGameUpdates} />
            <ToggleRow label="Special offers and sales" checked={specialOffers} onCheckedChange={setSpecialOffers} />
            <ToggleRow label="Chat messages" checked={chatMessages} onCheckedChange={setChatMessages} />
          </TabsContent>

          <div className="mt-6 flex gap-2">
            <Button
              variant="ghost"
              className="text-[13px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-5 py-2 h-auto rounded-sm transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Tabs>
  )
}
