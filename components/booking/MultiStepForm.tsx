'use client';

import { useState, ReactNode } from 'react';
import { Stepper } from './Stepper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
  content: ReactNode;
  validate?: () => boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  initialStep?: number;
  onStepChange?: (step: number) => void;
}

export function MultiStepForm({
  steps,
  onSubmit,
  onCancel,
  submitLabel = 'Сохранить',
  cancelLabel = 'Отмена',
  isSubmitting = false,
  className,
  initialStep = 0,
  onStepChange,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const step = steps[currentStep];
      if (step.validate && !step.validate()) {
        return;
      }
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSubmit = async () => {
    const step = steps[currentStep];
    if (step.validate && !step.validate()) {
      return;
    }
    await onSubmit();
  };

  const canGoNext = currentStep < steps.length - 1;
  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={className}>
      {/* Stepper */}
      <div className="mb-4 sm:mb-8">
        <Stepper
          steps={steps.map((s) => ({ title: s.title, description: s.description }))}
          currentStep={currentStep}
        />
      </div>

      {/* Step Content */}
      <div className="min-h-[300px] sm:min-h-[400px]">
        {steps[currentStep].content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-border">
        <div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-border rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelLabel}
            </button>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3">
          {canGoPrevious && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-border rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Назад</span>
            </button>
          )}

          {canGoNext ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              <span className="hidden sm:inline">Далее</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Сохранение...' : submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

