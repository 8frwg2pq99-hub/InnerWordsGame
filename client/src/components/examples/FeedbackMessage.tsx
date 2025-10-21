import FeedbackMessage from '../FeedbackMessage';

export default function FeedbackMessageExample() {
  return (
    <div className="space-y-3">
      <FeedbackMessage 
        message="+8 points (Inner 3-letter sequence, +2 length bonus)." 
        type="success" 
      />
      <FeedbackMessage 
        message='"RIA" is not a contiguous sequence in CORIANDER.' 
        type="error" 
      />
      <FeedbackMessage 
        message="Pick a contiguous sequence from CORIANDER to begin." 
        type="info" 
      />
    </div>
  );
}
