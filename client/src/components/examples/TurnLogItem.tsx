import TurnLogItem, { type TurnData } from '../TurnLogItem';

export default function TurnLogItemExample() {
  const turns: TurnData[] = [
    { 
      from: 'CORIANDER', 
      to: 'ARIA', 
      sequence: 'RIA', 
      type: 'INNER', 
      points: 8,
      sequencePoints: 6,
      lengthBonus: 2,
      totalScore: 8
    },
    { 
      from: 'ARIA', 
      to: 'RAIN', 
      sequence: 'RI', 
      type: 'EDGE', 
      points: 2,
      sequencePoints: 2,
      lengthBonus: 0,
      totalScore: 10
    },
  ];

  return (
    <div>
      {turns.map((turn, idx) => (
        <TurnLogItem key={idx} turn={turn} />
      ))}
    </div>
  );
}
