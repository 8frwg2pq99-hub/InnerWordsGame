// client/src/pages/Home.tsx
import { useState } from 'react';
import GameHeader from '@/components/GameHeader';
import CurrentWordDisplay from '@/components/CurrentWordDisplay';
import GameInstructions from '@/components/GameInstructions';
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
      return; // Don’t allow changing word during active game
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
        {/* Auth / Top Bar */}
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
                  Log In
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

        {/* ===== MOBILE-FIRST STACK WITH EXPLICIT ORDER ===== */}
        <div className="flex flex-col">
          {/* 1. Header + score */}
          <div className="order-1">
            <GameHeader score={score} />
          </div>

          {/* 2. Timer */}
          <div className="order-2 mb-4">
            <GameTimer isActive={isTimerActive} onTimeUp={handleTimeUp} duration={60} />
          </div>

          {/* 3. Big white word */}
          <div className="order-3">
            <CurrentWordDisplay word={currentWord} />
          </div>

          {/* 4. New/Change Word button */}
          <div className="order-4 flex items-center gap-3 mb-6 justify-center">
            <Button
              onClick={handleCycleWord}
              variant="outline"
              size="lg"
              disabled={isTimerActive || isGameOver}
              data-testid="button-new-word"
              className="text-base font-semibold px-8 gap-2 w-full max-w-[380px]"
            >
              <RefreshCw className="h-5 w-5" />
              New Word
            </Button>
          </div>

          {/* 5. Inputs (mobile before rules, desktop after rules) */}
          <div className="order-5 lg:order-6">
            <GameInputs
              newWord={newWord}
              onNewWordChange={setNewWord}
              onSubmit={handleSubmit}
              disabled={isGameOver}
            />
          </div>

          {/* 6. Rules (mobile after inputs, desktop before inputs) */}
          <div className="order-6 lg:order-5">
            <GameInstructions />
          </div>

          {/* 7. Footer with Submit/Reset (single source of truth for Reset) */}
          <div className="order-7">
            <GameFooter
              onReset={handleReset}
              onEndRun={handleEndRun}
              isGameActive={isTimerActive && !isGameOver}
            />
          </div>

          {/* Feedback + Turn log */}
          <div className="order-8">
            <FeedbackMessage message={message.text} type={message.type} />
            <TurnLog turns={turns} />
          </div>

          {/* Copyright */}
          <footer className="order-9 mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
            Created by Tom Kwei © 2025.
          </footer>
        </div>
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
