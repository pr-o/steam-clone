'use client'

import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import { isSignedInAtom } from '@/stores/userStore'

/**
 * Redirect to /login if the user is not signed in.
 * Returns the current sign-in state so callers can render a fallback while
 * the redirect happens.
 */
export function useRequireAuth(): boolean {
  const isSignedIn = useAtomValue(isSignedInAtom)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isSignedIn) {
      const next = encodeURIComponent(pathname)
      router.replace(`/login?next=${next}`)
    }
  }, [isSignedIn, router, pathname])

  return isSignedIn
}
