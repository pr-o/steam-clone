import { useState } from 'react'
import { Switch } from '@renderer/components/ui/switch'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { cn } from '@renderer/lib/utils'

type SettingsSection = 'interface' | 'account' | 'downloads' | 'ingame' | 'notifications'

const SECTIONS: { id: SettingsSection; label: string }[] = [
  { id: 'interface', label: 'Interface' },
  { id: 'account', label: 'Account' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'ingame', label: 'In-Game' },
  { id: 'notifications', label: 'Notifications' },
]

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
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-2 py-1 outline-none focus:border-steam-blue cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('interface')

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

  // Notifications
  const [friendRequests, setFriendRequests] = useState(true)
  const [gameUpdates, setGameUpdates] = useState(true)
  const [specialOffers, setSpecialOffers] = useState(false)
  const [chatMessages, setChatMessages] = useState(true)

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-[180px] shrink-0 border-r border-black/40 pt-4">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              'w-full text-left px-4 py-2.5 text-[13px] transition-colors relative',
              activeSection === s.id
                ? 'text-white bg-[#1b2838]'
                : 'text-steam-textMuted hover:text-steam-text hover:bg-white/5'
            )}
          >
            {activeSection === s.id && (
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-steam-blue" />
            )}
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-[600px]">
          <h2 className="text-white text-[18px] font-semibold mb-5">
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>

          {activeSection === 'interface' && (
            <div>
              <SelectRow label="Language" value={language} options={['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese (Simplified)']} onChange={setLanguage} />
              <ToggleRow label="Enable smooth scrolling" checked={smoothScrolling} onCheckedChange={setSmoothScrolling} />
              <ToggleRow label="Enable animations" description="Disabling may improve performance on slower machines." checked={animations} onCheckedChange={setAnimations} />
              <ToggleRow label="Display FPS counter in-game" checked={showFps} onCheckedChange={setShowFps} />
              <div className="py-3 border-b border-steam-borderSubtle">
                <p className="text-steam-text text-[13px] mb-1">Skin / Theme</p>
                <p className="text-steam-textMuted text-[12px]">Steam Dark (default) — no other themes available.</p>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div>
              <div className="py-3 border-b border-steam-borderSubtle">
                <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Display Name</p>
                <input
                  defaultValue="SteamUser"
                  className="w-full bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
                />
              </div>
              <div className="py-3 border-b border-steam-borderSubtle">
                <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Email Address</p>
                <input
                  defaultValue="user@example.com"
                  type="email"
                  className="w-full bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
                />
              </div>
              <div className="py-3">
                <button className="text-[12px] font-semibold text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-4 py-2 rounded-sm transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeSection === 'downloads' && (
            <div>
              <div className="py-3 border-b border-steam-borderSubtle">
                <p className="text-steam-textDim text-[11px] uppercase tracking-wider mb-1">Default Install Folder</p>
                <div className="flex gap-2">
                  <input
                    defaultValue="C:\\Program Files (x86)\\Steam"
                    className="flex-1 bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-3 py-2 outline-none focus:border-steam-blue"
                    readOnly
                  />
                  <button className="text-[12px] text-white bg-[#4a7a9b] hover:bg-[#5a8aab] px-3 py-2 rounded-sm transition-colors shrink-0">
                    Browse
                  </button>
                </div>
              </div>
              <ToggleRow label="Keep games up to date automatically" checked={autoUpdate} onCheckedChange={setAutoUpdate} />
              <ToggleRow label="Allow downloads during gameplay" description="Enabling this may affect game performance." checked={downloadWhilePlaying} onCheckedChange={setDownloadWhilePlaying} />
              <SelectRow label="Bandwidth limit" value={throttle} options={['No limit', '1 MB/s', '5 MB/s', '10 MB/s', '25 MB/s', '50 MB/s']} onChange={setThrottle} />
            </div>
          )}

          {activeSection === 'ingame' && (
            <div>
              <ToggleRow label="Enable the Steam Overlay while in-game" checked={overlay} onCheckedChange={setOverlay} />
              <ToggleRow label="Display FPS counter" description="Shows a frames-per-second counter in the top-left corner." checked={fpsCounter} onCheckedChange={setFpsCounter} />
              <ToggleRow label="Screenshot shortcut (F12)" checked={screenshot} onCheckedChange={setScreenshot} />
              <div className="py-3 border-b border-steam-borderSubtle">
                <p className="text-steam-text text-[13px] mb-1">FPS counter position</p>
                <select
                  disabled={!fpsCounter}
                  className="bg-[#316282] text-steam-text text-[12px] border border-[#1b4d6e] rounded-sm px-2 py-1 outline-none focus:border-steam-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  {['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <ToggleRow label="Friend requests" checked={friendRequests} onCheckedChange={setFriendRequests} />
              <ToggleRow label="Game updates available" checked={gameUpdates} onCheckedChange={setGameUpdates} />
              <ToggleRow label="Special offers and sales" checked={specialOffers} onCheckedChange={setSpecialOffers} />
              <ToggleRow label="Chat messages" checked={chatMessages} onCheckedChange={setChatMessages} />
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button className="text-[13px] font-semibold text-white bg-steam-blue hover:bg-steam-cerulean px-5 py-2 rounded-sm transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
