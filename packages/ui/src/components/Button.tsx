import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    primary: 'bg-[#1a9fff] text-white hover:bg-[#4db8ff] active:bg-[#0d8ae6]',
    secondary: 'bg-[#2a475e] text-[#c7d5e0] hover:bg-[#3a5a73] active:bg-[#1e3448]',
    ghost: 'text-[#c7d5e0] hover:bg-[#2a475e] active:bg-[#1e3448]',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded',
    md: 'h-10 px-4 text-sm rounded',
    lg: 'h-12 px-6 text-base rounded',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
