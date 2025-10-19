import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';
import { loadProgress, saveProgress, addGardenPlant } from '@/utils/storage';

interface MultiplicationGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

interface Level {
  id: number;
  name: string;
  emoji: string;
  multipliers: number[];
  description: string;
  plant: string;
}

const levels: Level[] = [
  { id: 1, name: 'Первые ростки', emoji: '🌱', multipliers: [1, 2, 3], description: 'Легкое начало', plant: '🌼' },
  { id: 2, name: 'Цветущая поляна', emoji: '🌸', multipliers: [4, 5, 6], description: 'Средняя сложность', plant: '🌺' },
  { id: 3, name: 'Волшебный лес', emoji: '🌳', multipliers: [7, 8, 9], description: 'Сложные примеры', plant: '🌲' },
  { id: 4, name: 'Сад мудреца', emoji: '🏛️', multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9], description: 'Вся таблица', plant: '🏆' }
];

const visualAssociations: Record<number, string> = {
  2: '🦋', 3: '☘️', 4: '🪑', 5: '✋', 6: '🐛', 7: '🌈', 8: '🕸️', 9: '⭐'
};

const MultiplicationGame = ({ onComplete, onBack }: MultiplicationGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [question, setQuestion] = useState<Question>({ num1: 2, num2: 3, answer: 6 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [garden, setGarden] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    const progress = loadProgress();
    setCurrentLevel(progress.multiplicationLevel || 1);
    setScore(progress.multiplicationScore || 0);
    setGarden(progress.gardenPlants || []);
  }, []);

  const level = levels[currentLevel - 1];

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const generateQuestion = () => {
    const multipliers = level.multipliers;
    const num1 = multipliers[Math.floor(Math.random() * multipliers.length)];
    const num2 = Math.floor(Math.random() * 10) + 1;
    setQuestion({ num1, num2, answer: num1 * num2 });
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === question.answer) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
      setGarden(prev => [...prev, level.plant]);
      addGardenPlant(level.plant);
      setQuestionsAnswered(prev => prev + 1);

      setTimeout(() => {
        if (questionsAnswered + 1 >= 10) {
          if (currentLevel < levels.length) {
            const newLevel = currentLevel + 1;
            setCurrentLevel(newLevel);
            saveProgress({ 
              multiplicationLevel: newLevel,
              multiplicationScore: score + 1
            });
            setQuestionsAnswered(0);
            setLives(3);
          } else {
            soundManager.playComplete();
            saveProgress({ 
              multiplicationScore: score + 1
            });
            onComplete(5);
          }
        } else {
          saveProgress({ 
            multiplicationScore: score + 1
          });
          generateQuestion();
        }
      }, 1500);
    } else {
      soundManager.playWrong();
      setLives(prev => prev - 1);

      setTimeout(() => {
        if (lives - 1 <= 0) {
          onComplete(Math.floor(score / 3));
        } else {
          generateQuestion();
        }
      }, 1500);
    }
  };

  const generateAnswers = () => {
    const correct = question.answer;
    const answers = [correct];
    
    while (answers.length < 4) {
      const wrong = correct + (Math.floor(Math.random() * 10) - 5);
      if (wrong > 0 && !answers.includes(wrong)) {
        answers.push(wrong);
      }
    }
    
    return answers.sort(() => Math.random() - 0.5);
  };

  const answers = generateAnswers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-pink-50 to-yellow-100 p-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  i <= lives ? 'bg-red-400 animate-pulse' : 'bg-gray-300'
                }`}
              >
                {i <= lives ? '❤️' : '🖤'}
              </div>
            ))}
          </div>

          <Badge variant="secondary" className="px-4 py-2 text-lg">
            <Icon name="Flower" className="mr-2 text-pink-500" size={20} />
            {score} цветов
          </Badge>
        </div>

        <Card className="mb-6 p-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white border-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">
                {level.emoji} {level.name}
              </h2>
              <p className="text-purple-100">{level.description}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">{level.plant}</div>
              <p className="text-sm">Уровень {currentLevel}/4</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс уровня</span>
              <span>{questionsAnswered}/10</span>
            </div>
            <Progress value={questionsAnswered * 10} className="h-3 bg-purple-200" />
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white shadow-2xl border-4 border-green-400">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  Реши пример и вырасти цветок! 🌸
                </h3>
                
                <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-3xl p-8 mb-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-5xl">{visualAssociations[question.num1] || '🔢'}</div>
                    <div className="text-7xl font-bold text-purple-600 animate-scale-in">
                      {question.num1} × {question.num2} = ?
                    </div>
                  </div>

                  {showHint && (
                    <div className="mb-6 p-4 bg-blue-100 rounded-2xl animate-scale-in">
                      <div className="text-sm font-bold text-blue-800 mb-2">💡 Подсказка мудрой совы:</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: question.num1 }).map((_, groupIndex) => (
                          <div key={groupIndex} className="flex gap-1 p-2 bg-white rounded-lg">
                            {Array.from({ length: question.num2 }).map((_, itemIndex) => (
                              <div key={itemIndex} className="w-6 h-6 bg-purple-400 rounded-full" />
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className="text-blue-700 mt-2">
                        {question.num1} группы по {question.num2} = {question.answer}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {answers.map((answer) => (
                      <Button
                        key={answer}
                        onClick={() => handleAnswer(answer)}
                        disabled={showResult}
                        size="lg"
                        className={`h-20 text-4xl font-bold transition-all duration-300 ${
                          showResult && answer === question.answer
                            ? 'bg-green-500 hover:bg-green-500 scale-110 ring-4 ring-green-300'
                            : showResult && answer === selectedAnswer
                            ? 'bg-red-500 hover:bg-red-500'
                            : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                        }`}
                      >
                        {answer}
                      </Button>
                    ))}
                  </div>
                </div>

                {!showHint && !showResult && (
                  <Button
                    onClick={() => setShowHint(true)}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Icon name="Lightbulb" size={20} />
                    Показать подсказку
                  </Button>
                )}

                {showResult && (
                  <div className="mt-6 animate-scale-in">
                    {selectedAnswer === question.answer ? (
                      <div>
                        <div className="text-4xl font-bold text-green-600 mb-3">
                          🎉 Отлично! Цветок расцвел!
                        </div>
                        <p className="text-lg text-gray-600">
                          {question.num1} × {question.num2} = {question.answer} ✅
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-orange-600 mb-3">
                          💪 Попробуй еще раз!
                        </div>
                        <p className="text-lg text-gray-600">
                          Правильный ответ: {question.num1} × {question.num2} = {question.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-yellow-50 border-4 border-green-300 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🌺</div>
                <h3 className="text-2xl font-heading font-bold">Твой сад</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-4 mb-4 min-h-[200px] border-4 border-dashed border-green-300">
                <div className="grid grid-cols-5 gap-2">
                  {garden.map((plant, index) => (
                    <div
                      key={index}
                      className="text-3xl animate-scale-in"
                      style={{ animationDelay: `${(index % 10) * 50}ms` }}
                    >
                      {plant}
                    </div>
                  ))}
                  {garden.length === 0 && (
                    <div className="col-span-5 text-center text-gray-400 py-8">
                      Сад пока пуст... <br />Решай примеры!
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 border-2 border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Прогресс:</span>
                    <span className="text-sm text-gray-600">{score} примеров</span>
                  </div>
                  <Progress value={(score % 10) * 10} className="h-2" />
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 border-2 border-blue-300">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl">🦉</div>
                    <div>
                      <p className="text-xs font-bold text-blue-800">Мудрая сова говорит:</p>
                      <p className="text-xs text-blue-700">
                        {score < 5 
                          ? 'Отличное начало! Продолжай в том же духе!'
                          : score < 10
                          ? 'Ты молодец! Твой сад растет!'
                          : 'Ты настоящий мастер умножения!'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-100 rounded-xl p-3 border-2 border-yellow-300">
                  <div className="text-xs font-bold mb-2">📊 Изучаем:</div>
                  <div className="flex flex-wrap gap-1">
                    {level.multipliers.map(num => (
                      <Badge key={num} variant="outline" className="text-xs">
                        ×{num} {visualAssociations[num]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {currentLevel === levels.length && questionsAnswered >= 10 && (
          <Card className="mt-6 p-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-4xl font-heading font-bold mb-2">Поздравляем!</h3>
            <p className="text-xl mb-4">Ты прошел все уровни Волшебного Сада!</p>
            <div className="text-5xl mb-2">{garden.slice(-10).join(' ')}</div>
            <p className="text-lg">Выращено цветов: {garden.length}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiplicationGame;