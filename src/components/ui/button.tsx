import { cn } from "@/lib/utils"

interface ButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

export function Button({ 
  children, 
  className, 
  variant = "default", 
  size = "default", 
  type = "button",
  onClick 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50"
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100"
  }
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </button>
  )
}