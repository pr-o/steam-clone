import { useAtomValue } from 'jotai'
import { activeSidebarGameAtom } from '@renderer/stores/uiStore'
import { installedGamesAtom } from '@renderer/stores/libraryStore'
import { ScrollArea } from '@renderer/components/ui/scroll-area'

const MOCK_NEWS = [
  { title: 'Latest Patch Notes — v1.4.2', date: 'Mar 19, 2026', excerpt: 'This update addresses several community-reported issues and adds quality-of-life improvements to matchmaking, movement physics, and the HUD.', image: '' },
  { title: 'Season 3 Begins', date: 'Mar 12, 2026', excerpt: 'Season 3 kicks off with new maps, ranked rewards, and a limited-time event mode. Dive in and earn exclusive cosmetics before March 31.', image: '' },
  { title: 'Community Workshop Update', date: 'Mar 5, 2026', excerpt: 'The Workshop now supports custom game modes. Browse thousands of community-created experiences.', image: '' },
]

const MOCK_GUIDES = [
  { title: 'Beginner\'s Complete Guide', author: 'ProGamer99', upvotes: 4821 },
  { title: 'Advanced Movement Techniques', author: 'SpeedrunKing', upvotes: 3102 },
  { title: 'Optimal Settings for Competitive Play', author: 'TechWizard', upvotes: 2984 },
  { title: 'All Achievement Locations', author: 'AchievementHunter', upvotes: 1739 },
]

export function CommunityView() {
  const selectedGame = useAtomValue(activeSidebarGameAtom)
  const installedGames = useAtomValue(installedGamesAtom)
  const game = selectedGame ?? installedGames[0]

  if (!game) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-steam-textMuted text-[14px]">Select a game to view its community hub.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-steam-borderSubtle">
          <img src={game.headerImage} alt={game.title} className="w-16 h-16 object-cover rounded-sm" />
          <div>
            <h2 className="text-white text-[16px] font-bold">{game.title}</h2>
            <p className="text-steam-textMuted text-[12px]">Community Hub</p>
          </div>
        </div>

        {/* News */}
        <div>
          <h3 className="text-steam-text text-[13px] font-semibold uppercase tracking-wider mb-3">Latest News</h3>
          <div className="space-y-3">
            {MOCK_NEWS.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-steam-card rounded-sm hover:bg-steam-cardHover transition-colors cursor-pointer">
                <img
                  src={`https://placehold.co/120x67/1b2838/66c0f4?text=News`}
                  alt=""
                  className="w-[120px] h-[67px] object-cover rounded-sm shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-steam-text text-[13px] font-medium leading-tight">{item.title}</p>
                  <p className="text-steam-textDim text-[10px] mt-0.5 mb-1">{item.date}</p>
                  <p className="text-steam-textMuted text-[11px] leading-relaxed line-clamp-2">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div>
          <h3 className="text-steam-text text-[13px] font-semibold uppercase tracking-wider mb-3">Popular Guides</h3>
          <div className="space-y-1.5">
            {MOCK_GUIDES.map((guide, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-steam-card hover:bg-steam-cardHover rounded-sm cursor-pointer transition-colors">
                <div>
                  <p className="text-steam-text text-[12px] font-medium">{guide.title}</p>
                  <p className="text-steam-textMuted text-[10px] mt-0.5">by {guide.author}</p>
                </div>
                <span className="text-steam-accentPale text-[11px] shrink-0 ml-4">▲ {guide.upvotes.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        <div>
          <h3 className="text-steam-text text-[13px] font-semibold uppercase tracking-wider mb-3">Screenshots</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {game.screenshots.slice(0, 6).map((src, i) => (
              <div key={i} className="overflow-hidden rounded-sm cursor-pointer group">
                <img src={src} alt="" className="w-full h-[90px] object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
