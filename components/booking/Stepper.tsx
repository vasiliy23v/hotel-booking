'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    isCompleted && 'bg-gray-900 dark:bg-primary border-gray-900 dark:border-primary text-white dark:text-primary-foreground',
                    isCurrent && 'bg-white dark:bg-card border-gray-900 dark:border-primary text-gray-900 dark:text-foreground',
                    isUpcoming && 'bg-white dark:bg-card border-gray-300 dark:border-border text-gray-400 dark:text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      isCurrent && 'text-gray-900 dark:text-foreground',
                      isCompleted && 'text-gray-600 dark:text-muted-foreground',
                      isUpcoming && 'text-gray-400 dark:text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">{step.description}</div>
                  )}
                </div>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    isCompleted ? 'bg-gray-900 dark:bg-primary' : 'bg-gray-300 dark:bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

