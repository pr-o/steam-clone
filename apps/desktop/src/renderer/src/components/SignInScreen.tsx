import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { motion } from 'motion/react'
import { LogIn } from 'lucide-react'
import { signInAtom } from '@renderer/stores/userStore'
import { MOCK_USER } from '@renderer/mocks/data/users'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'

export function SignInScreen() {
  const signIn = useSetAtom(signInAtom)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Enter your account name and password.')
      return
    }
    signIn({ ...MOCK_USER, displayName: username || MOCK_USER.displayName })
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-steam-bg px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="w-full max-w-[360px] bg-gradient-to-br from-[#1b4a6b] to-[#0d2d45] border border-[#2a5a7a]/60 rounded-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-sm bg-steam-blue/15 flex items-center justify-center">
            <LogIn size={16} className="text-steam-accentPale" />
          </div>
          <div>
            <h1 className="text-white text-[16px] font-semibold leading-tight">
              Sign in to Steam
            </h1>
            <p className="text-steam-textMuted text-[11px]">Demo client</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-steam-textDim text-[10px] uppercase tracking-wider">
              Account name
            </span>
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              autoFocus
              className="mt-1 bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue"
            />
          </label>
          <label className="block">
            <span className="text-steam-textDim text-[10px] uppercase tracking-wider">
              Password
            </span>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="mt-1 bg-[#316282] text-steam-text text-[13px] border border-[#1b4d6e] rounded-sm h-9 focus:border-steam-blue"
            />
          </label>

          {error && <p className="text-[#c34741] text-[12px]">{error}</p>}

          <Button
            type="submit"
            variant="ghost"
            className="w-full text-[13px] font-semibold text-white bg-[#5c7e10] hover:bg-[#6b9313] py-2 rounded-sm transition-colors"
          >
            Sign In
          </Button>

          <p className="text-steam-textDim text-[10px] text-center pt-1">
            Any non-empty values work — this is a demo client.
          </p>
        </form>
      </motion.div>
    </div>
  )
}
