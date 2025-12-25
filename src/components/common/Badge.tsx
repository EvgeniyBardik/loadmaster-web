import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info',
    gray: 'badge-gray',
  }

  return (
    <span className={clsx('badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    pending: { variant: 'gray', label: 'Pending' },
    queued: { variant: 'info', label: 'Queued' },
    running: { variant: 'warning', label: 'Running' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
    cancelled: { variant: 'gray', label: 'Cancelled' },
  }

  const config = statusConfig[status] || { variant: 'gray', label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

