import RulesPanel from '@/components/RulesPanel';
import { useState } from 'react';
import GameHeader from '@/components/GameHeader';
import CurrentWordDisplay from '@/components/CurrentWordDisplay';
import GameInputs from '@/components/GameInputs';
import GameFooter from '@/components/GameFooter';
import FeedbackMessage from '@/components/FeedbackMessage';
import TurnLog from '@/components/TurnLog';
import GameTimer from '@/components/GameTimer';
import GameOverSummary from '@/components/GameOverSummary';
import Leaderboard from '@/components/Leaderboard';
import { type TurnData } from '@/components/TurnLogItem';
import { Button } from '@/components/ui/button';
import { Trophy, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AVAILABLE_WORDS = ['CORIANDER', 'CHEWINESS', 'MASTODON', 'SCUTTLING', 'REWINDER'];

export default function Home() {
  const [selectedWord, setSelectedWord] = useState(AVAILABLE_WORDS[0]);
  const [currentWord, setCurrentWord] = useState(selectedWord);
  const [score, setScore] = useState(0);
  const [prevWordLen, setPrevWordLen] = useState(selectedWord.length);
  const [newWord, setNewWord] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({
    text: '',
    type: 'info',
  });
  const [turns, setTurns] = useState<TurnData[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  const normalize = (s: string) => s.trim().toUpperCase();

  const isInnerSequence = (base: string, startIndex: number, seqLen: number) => {
    if (startIndex === 0) return false;
    if (startIndex + seqLen === base.length) return false;
    return true;
  };

  const findSequenceInWord = (base: string, word: string): { sequence: string; indexInBase: number; indexInWord: number } | null => {
    let longestSeq = '';
    let longestIndexBase = -1;
    let longestIndexWord = -1;

    for (let i = 0; i < base.length; i++) {
      for (let j = i + 2; j <= base.length; j++) {
        const seq = base.substring(i, j);
        const indexInWord = word.indexOf(seq);
        
        if (indexInWord !== -1 && seq.length > longestSeq.length) {
          longestSeq = seq;
          longestIndexBase = i;
          longestIndexWord = indexInWord;
        }
      }
    }

    if (longestSeq.length < 2) return null;
    
    return {
      sequence: longestSeq,
      indexInBase: longestIndexBase,
      indexInWord: longestIndexWord
    };
  };

  const verifyWordStructure = (word: string, sequence: string, indexInWord: number): boolean => {
    const prefix = word.substring(0, indexInWord);
    const suffix = word.substring(indexInWord + sequence.length);
    return word === prefix + sequence + suffix;
  };

  const handleSubmit = () => {
    if (isGameOver) return;

    const base = normalize(currentWord);
    const word = normalize(newWord);

    if (word.length < 2) {
      setMessage({ text: 'New word must be at least 2 letters.', type: 'error' });
      return;
    }
    if (!/^[A-Z]+$/.test(word)) {
      setMessage({ text: 'New word must be letters only (A–Z).', type: 'error' });
      return;
    }

    const result = findSequenceInWord(base, word);
    
    if (!result) {
      setMessage({ 
        text: `No contiguous sequence from ${base} found in ${word}. The new word must contain at least 2 consecutive letters from the current word.`, 
        type: 'error' 
      });
      return;
    }

    const { sequence, indexInBase, indexInWord } = result;

    if (!verifyWordStructure(word, sequence, indexInWord)) {
      setMessage({ 
        text: `Letters cannot be inserted inside the sequence "${sequence}".`, 
        type: 'error' 
      });
      return;
    }

    // Start timer on first successful move
    if (!isTimerActive && turns.length === 0) {
      setIsTimerActive(true);
    }

    const inner = isInnerSequence(base, indexInBase, sequence.length);
    const seqPoints = sequence.length * (inner ? 2 : 1);
    const lengthBonus = Math.max(0, word.length - prevWordLen);
    const points = seqPoints + lengthBonus;
    const newScore = score + points;

    setScore(newScore);
    setPrevWordLen(word.length);
    
    const bonusText = lengthBonus ? `, +${lengthBonus} length bonus` : '';
    setMessage({ 
      text: `+${points} points (${inner ? 'Inner' : 'Edge'} ${sequence.length}-letter sequence: "${sequence}"${bonusText}).`, 
      type: 'success' 
    });

    setTurns([
      { 
        from: currentWord, 
        to: word, 
        sequence, 
        type: inner ? 'INNER' : 'EDGE', 
        points,
        sequencePoints: seqPoints,
        lengthBonus,
        totalScore: newScore
      },
      ...turns
    ]);

    setCurrentWord(word);
    setNewWord('');
  };

  const handleTimeUp = () => {
    setIsGameOver(true);
    setIsTimerActive(false);
    setMessage({ text: 'Time is up! Check out your final score above.', type: 'info' });
  };

  const handleReset = () => {
    setScore(0);
    setCurrentWord(selectedWord);
    setPrevWordLen(selectedWord.length);
    setNewWord('');
    setTurns([]);
    setIsTimerActive(false);
    setIsGameOver(false);
    setMessage({ text: '', type: 'info' });
  };

  const handleEndRun = () => {
    setIsGameOver(true);
    setIsTimerActive(false);
    setMessage({ text: 'Run ended. Check out your final score above.', type: 'info' });
  };

  const handleChangeWord = (word: string) => {
    if (isTimerActive || isGameOver) {
      return; // Don't allow changing word during active game
    }
    setSelectedWord(word);
    setCurrentWord(word);
    setPrevWordLen(word.length);
    setScore(0);
    setNewWord('');
    setTurns([]);
    setMessage({ text: '', type: 'info' });
  };

  const handleCycleWord = () => {
    if (isTimerActive || isGameOver) return;
    
    const currentIndex = AVAILABLE_WORDS.indexOf(selectedWord);
    const nextIndex = (currentIndex + 1) % AVAILABLE_WORDS.length;
    const nextWord = AVAILABLE_WORDS[nextIndex];
    handleChangeWord(nextWord);
  };

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleViewLeaderboard = () => {
    setShowLeaderboard(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-card border border-card-border rounded-xl p-8 shadow-xl">
        {/* Auth Section */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleViewLeaderboard}
              variant="outline"
              size="sm"
              data-testid="button-view-leaderboard"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.firstName || user.email?.split('@')[0] || 'Player'}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  data-testid="button-logout"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                variant="outline"
                size="sm"
                data-testid="button-login"
              >
                Log In
              </Button>
            )}
          </div>
        </div>

        <GameHeader score={score} />
        
        <div className="mb-4">
          <GameTimer 
            isActive={isTimerActive} 
            onTimeUp={handleTimeUp}
            duration={60}
          />
        </div>

        <CurrentWordDisplay word={currentWord} />
        
        {/* New Word Button */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Button
            onClick={handleCycleWord}
            variant="outline"
            size="lg"
            disabled={isTimerActive || isGameOver}
            data-testid="button-new-word"
            className="text-base font-semibold px-8 gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Change Word
          </Button>
        </div>

       <RulesPanel />

{/* Mobile-first reorder: Inputs above Rules on mobile; Rules above Inputs on desktop */}
<div className="flex flex-col gap-3 md:gap-6">
  {/* Inputs FIRST on mobile, SECOND on desktop */}
  <div className="order-2 md:order-3">
    <GameInputs
      newWord={newWord}
      onNewWordChange={setNewWord}
      onSubmit={handleSubmit}
      disabled={isGameOver}
    />
    <GameFooter
      onReset={handleReset}
      onEndRun={handleEndRun}
      isGameActive={isTimerActive && !isGameOver}
    />
  </div>

  {/* Rules SECOND on mobile, FIRST on desktop */}
  <div className="order-3 md:order-2">
    <GameInstructions />
  </div>
</div>

        <FeedbackMessage message={message.text} type={message.type} />
        <TurnLog turns={turns} />
        
        {/* Copyright Footer */}
        <footer className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Created by Tom Kwei © 2025.
        </footer>
      </div>

      {isGameOver && (
        <GameOverSummary 
          score={score} 
          turns={turns}
          startingWord={selectedWord}
          onPlayAgain={handleReset}
        />
      )}

      {showLeaderboard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-card border-2 border-primary rounded-xl p-8 max-w-2xl w-full my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-3xl font-bold">Global Leaderboard</h2>
                  <p className="text-sm text-muted-foreground">{selectedWord}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowLeaderboard(false)}
                variant="ghost"
                size="icon"
                data-testid="button-close-leaderboard"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <Leaderboard startingWord={selectedWord} />
          </div>
        </div>
      )}
    </div>
  );
}
