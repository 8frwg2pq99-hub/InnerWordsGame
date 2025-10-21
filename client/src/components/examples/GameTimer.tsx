import { useState } from 'react';
import GameTimer from '../GameTimer';
import { Button } from '@/components/ui/button';

export default function GameTimerExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="space-y-4">
      <GameTimer 
        isActive={isActive} 
        onTimeUp={() => {
          setIsActive(false);
          console.log('Time is up!');
        }}
        duration={10} // 10 seconds for demo
      />
      <Button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Stop' : 'Start'} Timer
      </Button>
    </div>
  );
}
