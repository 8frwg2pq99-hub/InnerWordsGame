import GameFooter from '../GameFooter';

export default function GameFooterExample() {
  return <GameFooter onReset={() => console.log('Reset clicked')} />;
}
