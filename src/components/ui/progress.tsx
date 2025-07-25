import { cn } from "@/lib/utils"

interface ProgressStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

interface ProgressTrackerProps {
  steps: ProgressStep[]
  className?: string
}

export function ProgressTracker({ steps, className }: ProgressTrackerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  {
                    "border-green-600 bg-green-600 text-white": step.status === 'completed',
                    "border-blue-600 bg-blue-600 text-white": step.status === 'current',
                    "border-gray-300 bg-white text-gray-500": step.status === 'upcoming',
                  }
                )}
              >
                {step.status === 'completed' ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={cn("text-xs font-medium", {
                  "text-green-600": step.status === 'completed',
                  "text-blue-600": step.status === 'current', 
                  "text-gray-500": step.status === 'upcoming',
                })}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 max-w-20">
                  {step.description}
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16 mx-4 mt-[-2rem]",
                  {
                    "bg-green-600": step.status === 'completed',
                    "bg-gray-300": step.status !== 'completed',
                  }
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}