import { SpecialSectionClient } from '@/components/specials/SpecialSectionClient'

export default async function SpecialSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <SpecialSectionClient slug={slug} />
}
