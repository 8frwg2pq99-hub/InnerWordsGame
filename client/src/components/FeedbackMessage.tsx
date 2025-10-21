import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function FeedbackMessage({ message, type }: FeedbackMessageProps) {
  if (!message) {
    return <div className="min-h-[22px] mt-2" data-testid="text-feedback"></div>;
  }

  const styles = {
    success: 'text-game-success',
    error: 'text-game-error',
    info: 'text-muted-foreground',
  };

  return (
    <div 
      className={`min-h-[22px] text-sm mt-2 flex items-center gap-2 ${styles[type]}`}
      data-testid="text-feedback"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {type === 'error' && <XCircle className="w-4 h-4" />}
      <span>{message}</span>
    </div>
  );
}
