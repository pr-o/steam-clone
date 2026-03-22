import React from 'react'
import type { Game } from '@steam-clone/types'

export interface GameCardProps {
  game: Game
  onClick?: (game: Game) => void
}

export function GameCard({ game, onClick }: GameCardProps) {
  const discount = game.price.discountPercent

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
        <div className="mt-2 flex items-center justify-between">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="bg-[#4c6b22] text-[#a4d007] text-xs font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
              <div className="flex flex-col">
                <span className="text-[#738895] text-xs line-through">
                  ${(game.price.initial / 100).toFixed(2)}
                </span>
                <span className="text-[#acdbf5] text-sm font-bold">
                  ${(game.price.final / 100).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[#acdbf5] text-sm font-bold">
              {game.price.isFree ? 'Free to Play' : `$${(game.price.final / 100).toFixed(2)}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
