'use client'

import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { isSignedInAtom } from '@/stores/userStore'

export function DiscoveryQueueBanner() {
  const isSignedIn = useAtomValue(isSignedInAtom)

  return (
    <section className="py-3">
      <div className="bg-[#1b4d6e] p-5 rounded-sm">
        <h3 className="text-white font-semibold text-[15px] mb-1">
          Explore Your Discovery Queue
        </h3>
        <p className="text-steam-textMuted text-[13px] mb-3">
          {isSignedIn
            ? 'View your personalized queue of top-selling, new and recommended titles.'
            : 'Sign in to discover top-selling, new and recommended titles.'}
        </p>
        {isSignedIn ? (
          <button className="text-[13px] font-semibold text-white px-4 py-1.5 rounded-sm bg-steam-blue hover:bg-steam-cerulean transition-colors">
            Explore Queue
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-block text-[13px] font-semibold text-white px-4 py-1.5 rounded-sm bg-steam-blue hover:bg-steam-cerulean transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </section>
  )
}
