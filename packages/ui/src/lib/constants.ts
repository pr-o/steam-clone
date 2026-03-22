// ─── Rating ───────────────────────────────────────────────────────────────────

export const RATING_COLOR: Record<string, string> = {
  'Overwhelmingly Positive': '#66c0f4',
  'Very Positive': '#66c0f4',
  'Mostly Positive': '#66c0f4',
  Mixed: '#b9a074',
  'Mostly Negative': '#c34741',
  'Very Negative': '#c34741',
  'Overwhelmingly Negative': '#c34741',
}

export const RATING_SHORT: Record<string, string> = {
  'Overwhelmingly Positive': 'Overwhelmingly Positive',
  'Very Positive': 'Very Positive',
  'Mostly Positive': 'Mostly Positive',
  Mixed: 'Mixed',
  'Mostly Negative': 'Mostly Negative',
  'Very Negative': 'Very Negative',
  'Overwhelmingly Negative': 'Overwhelmingly Negative',
}

// ─── Genre ────────────────────────────────────────────────────────────────────

export const GENRE_COLORS: Record<string, { from: string; to: string }> = {
  action:          { from: '#1a3a2a', to: '#0f2018' },
  rpg:             { from: '#2a1a3a', to: '#180f20' },
  strategy:        { from: '#1a2a3a', to: '#0f1820' },
  simulation:      { from: '#1a3a38', to: '#0f2020' },
  indie:           { from: '#2a2a1a', to: '#20200f' },
  'free to play':  { from: '#1a2a1a', to: '#0f1a0f' },
  adventure:       { from: '#2a1a1a', to: '#1a0f0f' },
}

export const SUB_GENRES: Record<string, string[]> = {
  action:     ['Action-Adventure', 'Action RPG', 'Arcade', 'Casual', 'Fighting', 'Open World', 'Platformer', 'Shooter'],
  rpg:        ['Action RPG', 'JRPG', 'Turn-Based', 'Roguelike', 'Tactical RPG', 'Open World'],
  strategy:   ['4X', 'City Builder', 'RTS', 'Tower Defense', 'Turn-Based', 'Grand Strategy'],
  simulation: ['City Builder', 'Farming', 'Flight', 'Management', 'Racing', 'Space'],
  indie:      ['Platformer', 'Puzzle', 'Roguelike', 'Metroidvania', 'Visual Novel'],
}

// ─── Steam Colors ─────────────────────────────────────────────────────────────

export const STEAM_COLORS = {
  pageBase: '#171a21',
  contentDark: '#1b2838',
  cardBase: '#16202d',
  sidebarPanel: '#2a475e',
  cerulean: '#00adee',
  blue: '#1a9fff',
  accentLight: '#66c0f4',
  textPrimary: '#c7d5e0',
  textSecondary: '#8f98a0',
  textDim: '#4e5d6e',
  discountBg: '#4c6b22',
  discountText: '#a4d007',
  salePrice: '#acdbf5',
  inputBg: '#316282',
  inputBorder: '#1b4d6e',
} as const
