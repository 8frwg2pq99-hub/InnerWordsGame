import GameOverSummary from '../GameOverSummary';
import { type TurnData } from '../TurnLogItem';

export default function GameOverSummaryExample() {
  const sampleTurns: TurnData[] = [
    {
      from: 'CORIANDER',
      to: 'ARIA',
      sequence: 'RIA',
      type: 'INNER',
      points: 6,
      sequencePoints: 6,
      lengthBonus: 0,
      totalScore: 6
    },
    {
      from: 'ARIA',
      to: 'ARIAN',
      sequence: 'ARIA',
      type: 'EDGE',
      points: 6,
      sequencePoints: 4,
      lengthBonus: 2,
      totalScore: 12
    },
    {
      from: 'ARIAN',
      sequence: 'AN',
      to: 'SPAN',
      type: 'EDGE',
      points: 3,
      sequencePoints: 2,
      lengthBonus: 1,
      totalScore: 15
    }
  ];

  return (
    <GameOverSummary 
      score={92} 
      turns={sampleTurns}
      onPlayAgain={() => console.log('Play again clicked')} 
    />
  );
}
