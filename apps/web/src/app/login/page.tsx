'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { currentUserAtom } from '@/stores/userStore'
import { MOCK_USER } from '@/mocks/data/users'
import { MOCK_GAMES } from '@/mocks/data/games'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

// A fixed grid of game header images for the blurred background
const BG_GAMES = MOCK_GAMES.slice(0, 20)

function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grid grid-cols-5 gap-0 h-full opacity-30 blur-[2px] scale-105">
        {BG_GAMES.map((game, i) => (
          <div key={i} className="relative overflow-hidden">
            <img
              src={game.headerImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1b2838]/70" />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const setUser = useSetAtom(currentUserAtom)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter your account name and password.')
      return
    }
    setUser(MOCK_USER)
    router.push('/')
  }

  const inputCls = cn(
    'w-full h-[34px] px-2 text-[13px] rounded-sm',
    'bg-[#316282] text-steam-text placeholder:text-steam-textDim',
    'border border-[#1b4d6e] focus:border-steam-blue focus:outline-none focus:ring-1 focus:ring-steam-blue',
    'transition-colors'
  )

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundGrid />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Sign in heading */}
        <h1 className="text-white text-[26px] font-semibold mb-5 self-start max-w-[500px] w-full mx-auto">
          Sign in
        </h1>

        {/* Card */}
        <div className="w-full max-w-[500px] bg-[#c6d4df]/10 border border-[#4a7a9b]/40 backdrop-blur-sm rounded-sm p-6">
          <div className="flex gap-6">
            {/* Left: form */}
            <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex flex-col gap-3">
              <div>
                <Label className="block text-steam-textDim text-[11px] uppercase tracking-wider mb-1">
                  Sign in with account name
                </Label>
                <Input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  className={inputCls}
                  autoComplete="username"
                />
              </div>

              <div>
                <Label className="block text-steam-textDim text-[11px] uppercase tracking-wider mb-1">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className={inputCls}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={checked => setRemember(checked === true)}
                  className="w-3.5 h-3.5 rounded-sm accent-steam-blue"
                />
                <Label htmlFor="remember" className="text-steam-textMuted text-[12px] cursor-pointer">
                  Remember me
                </Label>
              </div>

              {error && (
                <p className="text-[#c34741] text-[12px]">{error}</p>
              )}

              <Button
                type="submit"
                variant="ghost"
                className="w-full h-[34px] bg-steam-blue hover:bg-steam-cerulean text-white text-[13px] font-semibold rounded-sm transition-colors"
              >
                Sign In
              </Button>

              <div className="text-center">
                <Link
                  href="#"
                  className="text-steam-link hover:text-steam-linkHover text-[12px] transition-colors"
                >
                  Help, I can&apos;t sign in
                </Link>
              </div>
            </form>

            {/* Divider */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="flex-1 w-px bg-[#4a7a9b]/50" />
              <span className="text-steam-textDim text-[10px] uppercase tracking-wider">or</span>
              <div className="flex-1 w-px bg-[#4a7a9b]/50" />
            </div>

            {/* Right: QR */}
            <div className="flex flex-col items-center gap-3 shrink-0 w-[140px]">
              <p className="text-steam-textDim text-[11px] uppercase tracking-wider text-center leading-tight">
                Sign in with QR
              </p>
              <div className="bg-white p-1.5 rounded-sm">
                <img
                  src="https://placehold.co/120x120/ffffff/000000?text=QR"
                  alt="QR Code"
                  className="w-[120px] h-[120px]"
                />
              </div>
              <p className="text-steam-textMuted text-[11px] text-center leading-tight">
                Use the{' '}
                <Link href="#" className="text-steam-link hover:text-steam-linkHover transition-colors">
                  Steam Mobile App
                </Link>{' '}
                to sign in via QR Code
              </p>
            </div>
          </div>
        </div>

        {/* Create account */}
        <div className="w-full max-w-[500px] mt-3 flex items-center justify-between">
          <Link
            href="#"
            className="text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-4 py-2 rounded-sm transition-colors"
          >
            Create a free account
          </Link>
        </div>
      </div>

      {/* New to Steam banner */}
      <div className="relative z-10 bg-[#1b2838]/80 border-t border-[#4a7a9b]/30 py-8 px-4 text-center">
        <h2 className="text-white text-[18px] font-semibold mb-2">New to Steam?</h2>
        <p className="text-steam-textMuted text-[13px] max-w-[500px] mx-auto">
          It&apos;s free and easy. Discover thousands of games to play with millions of new friends.
          Join the Steam community today.
        </p>
        <Link
          href="#"
          className="inline-block mt-4 text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] px-5 py-2 rounded-sm transition-colors"
        >
          Create your free account
        </Link>
      </div>
    </div>
  )
}
