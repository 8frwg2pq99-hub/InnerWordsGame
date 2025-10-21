import { useState } from 'react';
import GameInputs from '../GameInputs';

export default function GameInputsExample() {
  const [newWord, setNewWord] = useState('');

  return (
    <GameInputs
      newWord={newWord}
      onNewWordChange={setNewWord}
      onSubmit={() => console.log('Submit clicked', { newWord })}
    />
  );
}
