import TurnLog from '../TurnLog';
import { type TurnData } from '../TurnLogItem';

export default function TurnLogExample() {
  const turns: TurnData[] = [
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
      to: 'RAIN', 
      sequence: 'RI', 
      type: 'EDGE', 
      points: 2,
      sequencePoints: 2,
      lengthBonus: 0,
      totalScore: 8
    },
    { 
      from: 'RAIN', 
      to: 'CORE', 
      sequence: 'OR', 
      type: 'INNER', 
      points: 4,
      sequencePoints: 4,
      lengthBonus: 0,
      totalScore: 12
    },
  ];

  return <TurnLog turns={turns} />;
}
