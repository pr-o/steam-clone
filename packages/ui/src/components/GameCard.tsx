import React from 'react'
import type { Game } from '@steam-clone/types'
import { PriceDisplay } from './PriceDisplay'

export interface GameCardProps {
  game: Game
  onClick?: (game: Game) => void
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(game)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(game)}
      className="group cursor-pointer rounded overflow-hidden bg-[#16202d] hover:bg-[#1b2838] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9fff]"
    >
      <div className="relative overflow-hidden aspect-[460/215]">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <p className="text-sm text-[#c7d5e0] font-medium truncate">{game.title}</p>
        <div className="mt-2">
          <PriceDisplay price={game.price} size="sm" />
        </div>
      </div>
    </div>
  )
}
