'use client';

interface CommentStepProps {
  comment: string;
  onCommentChange: (value: string) => void;
}

export function CommentStep({ comment, onCommentChange }: CommentStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">
          Опишите проблему, оставьте отзыв или напишите своё предложение <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Опишите проблему, которую вы обнаружили, оставьте отзыв о приложении или напишите своё предложение..."
          className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none resize-none"
          rows={8}
          required
        />
      </div>
    </div>
  );
}

