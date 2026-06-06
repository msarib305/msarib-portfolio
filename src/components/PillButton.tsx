import Link from 'next/link'
import type { ReactNode } from 'react'

type PillVariant = 'primary' | 'secondary'
type PillSize    = 'sm' | 'md' | 'lg'

interface PillButtonBaseProps {
  variant?: PillVariant
  size?: PillSize
  icon?: ReactNode
  children: ReactNode
  className?: string
}

interface PillButtonAsButton extends PillButtonBaseProps {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

interface PillButtonAsLink extends PillButtonBaseProps {
  href: string
  prefetch?: boolean
  download?: string
}

type PillButtonProps = PillButtonAsButton | PillButtonAsLink

function pillClass(variant: PillVariant = 'primary', size: PillSize = 'md', extra = ''): string {
  const sizeClass = size === 'md' ? '' : `pill-btn--${size}`
  return ['pill-btn', `pill-btn--${variant}`, sizeClass, extra].filter(Boolean).join(' ')
}

export function PillButton(props: PillButtonProps) {
  const { variant = 'primary', size = 'md', icon, children, className = '' } = props
  const cls = pillClass(variant, size, className)

  if (props.href !== undefined) {
    return (
      <Link href={props.href} prefetch={props.prefetch} download={props.download} className={cls}>
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={cls}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
