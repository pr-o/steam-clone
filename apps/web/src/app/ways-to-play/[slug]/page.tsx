import { WaysToPlayClient } from '@/components/waystoplay/WaysToPlayClient'

export default async function WaysToPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <WaysToPlayClient slug={slug} />
}
