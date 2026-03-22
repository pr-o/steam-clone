import { GenrePageClient } from '@/components/genre/GenrePageClient'

export default async function GenrePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  return <GenrePageClient genreName={name} />
}
