import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        hover && 'hover:shadow-lg transition-shadow cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

