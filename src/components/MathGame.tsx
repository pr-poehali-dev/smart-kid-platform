import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MathGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

const MathGame = ({ onComplete, onBack }: MathGameProps) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({ num1: 2, num2: 3, answer: 5 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setQuestion({ num1, num2, answer: num1 + num2 });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === question.answer) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (score + 1 >= 5) {
          onComplete(3);
        } else {
          generateQuestion();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    }
  };

  const answers = [
    question.answer,
    question.answer + 1,
    question.answer - 1,
    question.answer + 2
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < score ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              >
                {i < score ? '⭐' : ''}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-12 bg-white shadow-2xl border-4 border-primary">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-primary mb-2">
              Накорми дракона правильным количеством яблок! 🐉
            </h2>
            <p className="text-muted-foreground">Реши пример и выбери правильный ответ</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 mb-8">
            <div className="text-center mb-8">
              <div className="text-8xl font-bold text-purple-600 mb-4 animate-scale-in">
                {question.num1} + {question.num2} = ?
              </div>
              <div className="text-6xl animate-bounce-gentle">🐉</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {answers.map((answer) => (
                <Button
                  key={answer}
                  onClick={() => handleAnswer(answer)}
                  disabled={showResult}
                  size="lg"
                  className={`h-24 text-4xl font-bold transition-all duration-300 ${
                    showResult && answer === question.answer
                      ? 'bg-green-500 hover:bg-green-500 scale-110'
                      : showResult && answer === selectedAnswer
                      ? 'bg-red-500 hover:bg-red-500'
                      : ''
                  }`}
                  variant={showResult ? 'default' : 'outline'}
                >
                  <span className="mr-2">{answer}</span>
                  <span className="text-3xl">🍎</span>
                </Button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="text-center animate-scale-in">
              {selectedAnswer === question.answer ? (
                <div className="text-3xl font-bold text-green-600">
                  🎉 Отлично! Дракон сыт и доволен!
                </div>
              ) : (
                <div className="text-3xl font-bold text-orange-600">
                  💪 Попробуй ещё раз!
                </div>
              )}
            </div>
          )}
        </Card>

        {score >= 5 && (
          <Card className="mt-6 p-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-heading font-bold mb-2">Поздравляем!</h3>
            <p className="text-xl">Ты заработал 3 звезды! Дракон благодарит тебя!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MathGame;
