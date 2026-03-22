import { GameDetailPage } from '@/components/game/GameDetailPage'

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>
}) {
  const { id } = await params
  return <GameDetailPage gameId={Number(id)} />
}
