import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'toggle' | 'toggleSecondary'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  selected?: boolean
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  selected = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    'font-bold uppercase tracking-wider transition-all duration-200'

  const variantClasses = {
    primary: selected
      ? 'border-retro-accent bg-retro-accent text-retro-bg shadow-[0_0_15px_rgba(255,107,53,0.3)]'
      : 'bg-retro-surface border-4 border-retro-accent text-retro-accent hover:bg-retro-accent hover:text-retro-bg shadow-[0_0_15px_rgba(255,107,53,0.3)] hover:shadow-[0_0_25px_rgba(255,107,53,0.5)]',
    secondary: selected
      ? 'border-retro-secondary bg-retro-secondary text-retro-bg shadow-[0_0_15px_rgba(78,205,196,0.3)]'
      : 'bg-retro-surface border-4 border-retro-secondary text-retro-secondary hover:bg-retro-secondary hover:text-retro-bg shadow-[0_0_15px_rgba(78,205,196,0.3)] hover:shadow-[0_0_25px_rgba(78,205,196,0.5)]',
    toggle: selected
      ? 'border-retro-accent bg-retro-accent text-retro-bg shadow-[0_0_15px_rgba(255,107,53,0.3)]'
      : 'border-retro-text-muted text-retro-text-muted hover:border-retro-accent hover:text-retro-accent',
    toggleSecondary: selected
      ? 'border-retro-secondary bg-retro-secondary text-retro-bg shadow-[0_0_15px_rgba(78,205,196,0.3)]'
      : 'border-retro-text-muted text-retro-text-muted hover:border-retro-secondary hover:text-retro-secondary',
  }

  const sizeClasses = {
    sm: 'px-6 py-2 border-2 text-sm',
    md: 'px-6 py-2 border-2',
    lg: 'px-8 py-4 border-4 text-lg',
  }

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed'

  const combinedClasses =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim()

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
