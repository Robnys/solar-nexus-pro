export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors'
  
  const variantClasses = {
    default: 'bg-emerald-500 text-white border border-emerald-500',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700',
    destructive: 'bg-red-500 text-white border border-red-500',
    outline: 'border border-slate-600 text-slate-300 bg-transparent'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
