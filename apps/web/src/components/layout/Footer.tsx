import Link from 'next/link'

const FOOTER_COLUMNS = [
  {
    heading: 'Valve',
    links: [
      { label: 'About Valve', href: '/about' },
      { label: 'Jobs', href: '/jobs' },
      { label: 'Steamworks', href: '/steamworks' },
      { label: 'Steam Distribution', href: '/distribution' },
      { label: 'Support', href: '/support' },
      { label: 'Gift Cards', href: '/gifts' },
    ],
  },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Legal', href: '/legal' },
  { label: 'Steam Subscriber Agreement', href: '/ssa' },
  { label: 'Refunds', href: '/refunds' },
  { label: 'Cookies', href: '/cookies' },
]

export function Footer() {
  return (
    <footer className="bg-steam-bg border-t border-steam-borderSubtle mt-auto">
      {/* Top rule */}
      <div className="h-px bg-steam-borderSubtle" />

      <div className="max-w-[940px] mx-auto px-4 py-8">
        {/* Valve logo row */}
        <div className="flex items-start justify-between gap-8 flex-wrap">
          {/* Valve branding */}
          <div className="flex flex-col gap-3">
            {/* Valve wordmark placeholder */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-steam-textMuted tracking-widest uppercase">
                Valve
              </span>
            </div>
            <p className="text-[11px] text-steam-textMuted leading-relaxed max-w-[320px]">
              © {new Date().getFullYear()} Valve Corporation. All rights reserved. All trademarks are
              property of their respective owners in the US and other countries.
            </p>
            <p className="text-[11px] text-steam-textMuted">
              VAT included in all prices where applicable.
            </p>
          </div>

          {/* Link column */}
          <div className="flex flex-col gap-1.5">
            {FOOTER_COLUMNS[0].links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[11px] text-steam-textMuted hover:text-steam-link transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social icons placeholder */}
          <div className="flex items-center gap-3 pt-1">
            {['𝕏', 'f', 'in', 'YT'].map(icon => (
              <button
                key={icon}
                className="w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold text-steam-textMuted hover:text-white bg-[#2a3f5a] hover:bg-steam-sidebar transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Legal links row */}
        <div className="mt-6 pt-4 border-t border-steam-borderSubtle flex flex-wrap gap-x-4 gap-y-1">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] text-steam-textMuted hover:text-steam-link transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
