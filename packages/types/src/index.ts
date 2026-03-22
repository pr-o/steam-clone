// ─── Game ────────────────────────────────────────────────────────────────────

export interface Game {
  id: number
  appId: number
  title: string
  slug: string
  shortDescription: string
  description: string
  headerImage: string
  screenshots: string[]
  videos: GameVideo[]
  developer: string
  publisher: string
  releaseDate: string
  price: Price
  categories: Category[]
  genres: Genre[]
  tags: Tag[]
  platforms: Platforms
  rating: Rating
  playerCount?: number
  isFeatured: boolean
  isEarlyAccess: boolean
}

export interface GameVideo {
  id: number
  thumbnail: string
  mp4: string
  webm: string
}

export interface Price {
  currency: string
  initial: number
  final: number
  discountPercent: number
  isFree: boolean
}

export interface Rating {
  summary: 'Overwhelmingly Positive' | 'Very Positive' | 'Mostly Positive' | 'Mixed' | 'Mostly Negative' | 'Very Negative' | 'Overwhelmingly Negative'
  score: number
  totalReviews: number
}

export interface Platforms {
  windows: boolean
  mac: boolean
  linux: boolean
}

// ─── Category / Genre / Tag ───────────────────────────────────────────────────

export interface Category {
  id: number
  description: string
}

export interface Genre {
  id: number
  description: string
}

export interface Tag {
  id: number
  name: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  steamId: string
  username: string
  displayName: string
  avatar: string
  profileUrl: string
  countryCode: string
  memberSince: string
  isOnline: boolean
  currentGame?: Game
  library: LibraryEntry[]
  wishlist: number[]
  cart: CartItem[]
  wallet: WalletBalance
}

export interface LibraryEntry {
  gameId: number
  acquiredAt: string
  playtimeMinutes: number
  lastPlayedAt?: string
  achievements: AchievementProgress
}

export interface AchievementProgress {
  unlocked: number
  total: number
}

export interface WalletBalance {
  currency: string
  amount: number
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  gameId: number
  game: Game
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  estimatedTax: number
  total: number
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  gameId: number
  author: Pick<User, 'steamId' | 'displayName' | 'avatar'>
  recommended: boolean
  content: string
  playtimeAtReview: number
  createdAt: string
  helpful: number
  funny: number
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
