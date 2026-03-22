import { HeroCarousel } from '@/components/home/HeroCarousel'
import { FeaturedRow } from '@/components/home/FeaturedRow'
import { SpecialOffers } from '@/components/home/SpecialOffers'
import { DiscoveryQueueBanner } from '@/components/home/DiscoveryQueueBanner'
import { SteamDeckSection } from '@/components/home/SteamDeckSection'
import { TopSellersSection } from '@/components/home/TopSellersSection'

export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <div className="max-w-[940px] mx-auto px-4 sm:px-0">
        <FeaturedRow />
        <SpecialOffers />
        <DiscoveryQueueBanner />
        <SteamDeckSection />
        <TopSellersSection />
      </div>
    </div>
  )
}
