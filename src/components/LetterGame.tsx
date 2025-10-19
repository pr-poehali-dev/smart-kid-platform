import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';

interface LetterGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

const words = [
  { word: 'КОТ', image: '🐱', syllables: ['К', 'О', 'Т'] },
  { word: 'ДОМ', image: '🏠', syllables: ['Д', 'О', 'М'] },
  { word: 'САД', image: '🌳', syllables: ['С', 'А', 'Д'] },
  { word: 'МЯЧ', image: '⚽', syllables: ['М', 'Я', 'Ч'] },
  { word: 'СОК', image: '🧃', syllables: ['С', 'О', 'К'] }
];

const LetterGame = ({ onComplete, onBack }: LetterGameProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentWord = words[currentWordIndex];
  const shuffledLetters = [...currentWord.syllables, 'Б', 'Р', 'У'].sort(() => Math.random() - 0.5);

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.length < currentWord.syllables.length) {
      soundManager.playClick();
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);

      if (newSelected.length === currentWord.syllables.length) {
        setShowResult(true);
        const isCorrect = newSelected.join('') === currentWord.word;
        
        if (isCorrect) {
          soundManager.playCorrect();
          setScore(prev => prev + 1);
        } else {
          soundManager.playWrong();
        }

        setTimeout(() => {
          if (currentWordIndex + 1 < words.length) {
            setCurrentWordIndex(prev => prev + 1);
            setSelectedLetters([]);
            setShowResult(false);
          } else {
            soundManager.playComplete();
            onComplete(3);
          }
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    setSelectedLetters([]);
    setShowResult(false);
  };

  const isCorrect = selectedLetters.join('') === currentWord.word;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex gap-2">
            {words.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < score ? 'bg-yellow-400' : i === currentWordIndex ? 'bg-blue-400' : 'bg-gray-300'
                }`}
              >
                {i < score ? '⭐' : ''}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-12 bg-white shadow-2xl border-4 border-secondary">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-secondary mb-2">
              Собери слово из букв! 📚
            </h2>
            <p className="text-muted-foreground">Нажимай на буквы по порядку</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-9xl mb-6 animate-bounce-gentle">{currentWord.image}</div>
              
              <div className="flex justify-center gap-3 mb-8">
                {currentWord.syllables.map((_, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 bg-white rounded-2xl border-4 border-blue-300 flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg"
                  >
                    {selectedLetters[index] || '?'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {shuffledLetters.map((letter, index) => (
                  <Button
                    key={index}
                    onClick={() => handleLetterClick(letter)}
                    disabled={showResult || selectedLetters.includes(letter)}
                    size="lg"
                    className="h-16 text-3xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:opacity-30"
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>

            {selectedLetters.length > 0 && !showResult && (
              <div className="text-center">
                <Button onClick={handleReset} variant="outline" size="lg">
                  <Icon name="RotateCcw" className="mr-2" />
                  Начать заново
                </Button>
              </div>
            )}
          </div>

          {showResult && (
            <div className="text-center animate-scale-in">
              {isCorrect ? (
                <div className="text-3xl font-bold text-green-600">
                  🎉 Молодец! Правильно!
                </div>
              ) : (
                <div className="text-3xl font-bold text-orange-600">
                  💪 Почти получилось! Попробуй ещё раз!
                </div>
              )}
            </div>
          )}
        </Card>

        {score >= words.length && (
          <Card className="mt-6 p-8 bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-heading font-bold mb-2">Фантастика!</h3>
            <p className="text-xl">Ты собрал все слова! Получай 3 звезды!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LetterGame;