import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';
import { trackGameAttempt } from '@/utils/analytics';

interface AssociationGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface Word {
  foreign: string;
  native: string;
  associations: string[];
  correctOrder: number[];
  level: number;
  category: string;
}

const wordDatabase: Word[] = [
  {
    foreign: 'apple',
    native: 'яблоко',
    associations: ['👨‍🍳', '🔴', '🍎'],
    correctOrder: [0, 1, 2],
    level: 1,
    category: 'Еда'
  },
  {
    foreign: 'cat',
    native: 'кошка',
    associations: ['🐱', '🥛', '🐾'],
    correctOrder: [0, 1, 2],
    level: 1,
    category: 'Животные'
  },
  {
    foreign: 'sun',
    native: 'солнце',
    associations: ['🌅', '☀️', '😎'],
    correctOrder: [0, 1, 2],
    level: 1,
    category: 'Природа'
  },
  {
    foreign: 'house',
    native: 'дом',
    associations: ['🏠', '🌳', '🐶'],
    correctOrder: [0, 1, 2],
    level: 1,
    category: 'Предметы'
  },
  {
    foreign: 'happy',
    native: 'счастливый',
    associations: ['😊', '🎉', '🎁'],
    correctOrder: [0, 1, 2],
    level: 2,
    category: 'Эмоции'
  },
  {
    foreign: 'water',
    native: 'вода',
    associations: ['💧', '🌊', '🐠'],
    correctOrder: [0, 1, 2],
    level: 2,
    category: 'Природа'
  },
  {
    foreign: 'butterfly',
    native: 'бабочка',
    associations: ['🌺', '🦋', '🌈'],
    correctOrder: [0, 1, 2],
    level: 2,
    category: 'Животные'
  },
  {
    foreign: 'library',
    native: 'библиотека',
    associations: ['👦', '📚', '🏛️'],
    correctOrder: [0, 1, 2],
    level: 3,
    category: 'Места'
  }
];

type GameMode = 'build' | 'memorize' | 'recall';

const AssociationGame = ({ onComplete, onBack }: AssociationGameProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [mode, setMode] = useState<GameMode>('build');
  const [memorizeTime, setMemorizeTime] = useState(10);
  const [showWord, setShowWord] = useState(true);
  const [level, setLevel] = useState(1);
  const [wordsLearned, setWordsLearned] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);

  const currentWord = wordDatabase.filter(w => w.level === level)[currentWordIndex % wordDatabase.filter(w => w.level === level).length];

  useEffect(() => {
    shuffleImages();
  }, [currentWordIndex, mode]);

  useEffect(() => {
    if (mode === 'memorize' && memorizeTime > 0) {
      const timer = setTimeout(() => setMemorizeTime(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === 'memorize' && memorizeTime === 0) {
      setMode('recall');
      setShowWord(false);
      setSelectedAssociations([]);
    }
  }, [memorizeTime, mode]);

  const shuffleImages = () => {
    if (!currentWord) return;
    
    const distractors = ['🌟', '🎨', '🚗', '⚽', '🎸', '🌸'];
    const allImages = [...currentWord.associations, ...distractors.slice(0, 3)];
    setAvailableImages(allImages.sort(() => Math.random() - 0.5));
    setSelectedAssociations([]);
  };

  const handleImageClick = (image: string) => {
    if (selectedAssociations.length >= 3) return;
    
    soundManager.playClick();
    setSelectedAssociations(prev => [...prev, image]);
    setAvailableImages(prev => prev.filter(img => img !== image));
  };

  const handleRemoveImage = (index: number) => {
    const removed = selectedAssociations[index];
    setSelectedAssociations(prev => prev.filter((_, i) => i !== index));
    setAvailableImages(prev => [...prev, removed]);
  };

  const checkAnswer = () => {
    const isCorrect = selectedAssociations.every((img, i) => img === currentWord.associations[i]);
    
    setShowResult(true);

    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
      
      if (!wordsLearned.includes(currentWord.foreign)) {
        setWordsLearned(prev => [...prev, currentWord.foreign]);
      }

      setTimeout(() => {
        if (mode === 'build') {
          setMode('memorize');
          setMemorizeTime(10);
          setShowWord(true);
          setShowResult(false);
        } else if (mode === 'recall') {
          if (currentWordIndex + 1 >= wordDatabase.filter(w => w.level === level).length) {
            if (level < 3) {
              setLevel(prev => prev + 1);
              setCurrentWordIndex(0);
            } else {
              const timeSpent = Math.floor((Date.now() - startTime) / 1000);
              trackGameAttempt({
                game: 'associations',
                timestamp: new Date().toISOString(),
                score: wordsLearned.length,
                maxScore: wordDatabase.length,
                timeSpent,
                mistakes,
                hintsUsed
              });
              onComplete(5);
              return;
            }
          } else {
            setCurrentWordIndex(prev => prev + 1);
          }
          setMode('build');
          setShowResult(false);
        }
      }, 2000);
    } else {
      soundManager.playWrong();
      setMistakes(prev => prev + 1);
      
      setTimeout(() => {
        setShowResult(false);
        setSelectedAssociations([]);
        shuffleImages();
      }, 2000);
    }
  };

  const useHint = () => {
    if (selectedAssociations.length >= 3) return;
    
    setHintsUsed(prev => prev + 1);
    const nextCorrect = currentWord.associations[selectedAssociations.length];
    
    if (availableImages.includes(nextCorrect)) {
      handleImageClick(nextCorrect);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.foreign);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Icon name="Brain" className="mr-2 text-purple-500" size={20} />
              {wordsLearned.length} слов
            </Badge>
            <Badge className="px-4 py-2 text-lg">
              Уровень {level}
            </Badge>
          </div>
        </div>

        <Card className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-4 border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl">🧠</span>
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold mb-1">
                  {mode === 'build' ? 'Собери цепочку' : 
                   mode === 'memorize' ? 'Запомни ассоциации' : 
                   'Вспомни и повтори'}
                </h2>
                <p className="text-purple-100">
                  Категория: {currentWord?.category}
                </p>
              </div>
            </div>

            {mode === 'memorize' && (
              <div className="text-center">
                <div className="text-5xl font-bold">{memorizeTime}</div>
                <div className="text-sm">секунд</div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white shadow-2xl border-4 border-purple-400">
              {showWord && (
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 mb-4">
                    <p className="text-2xl text-gray-600 mb-2">{currentWord?.native}</p>
                    <div className="flex items-center justify-center gap-4">
                      <h3 className="text-6xl font-bold text-purple-600">
                        {currentWord?.foreign.toUpperCase()}
                      </h3>
                      <Button
                        onClick={speakWord}
                        size="lg"
                        variant="outline"
                        className="rounded-full w-16 h-16"
                      >
                        <Icon name="Volume2" size={28} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Link" className="text-purple-600" size={24} />
                  <h4 className="text-xl font-bold">Ассоциативная цепочка:</h4>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 min-h-[120px]">
                  <div className="flex items-center justify-center gap-4">
                    {selectedAssociations.map((img, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          onClick={() => !showResult && handleRemoveImage(index)}
                          className={`w-20 h-20 bg-white rounded-2xl border-4 border-purple-300 flex items-center justify-center text-5xl transition-all duration-300 ${
                            !showResult ? 'cursor-pointer hover:scale-110 hover:border-purple-500' : ''
                          } ${
                            showResult && img === currentWord.associations[index]
                              ? 'ring-4 ring-green-400 scale-110'
                              : showResult && img !== currentWord.associations[index]
                              ? 'ring-4 ring-red-400'
                              : ''
                          }`}
                        >
                          {img}
                        </div>
                        {index < 2 && (
                          <Icon name="ArrowRight" className="text-purple-400" size={32} />
                        )}
                      </div>
                    ))}

                    {selectedAssociations.length < 3 && (
                      Array.from({ length: 3 - selectedAssociations.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex items-center justify-center text-4xl text-gray-400">
                            ?
                          </div>
                          {i + selectedAssociations.length < 2 && (
                            <Icon name="ArrowRight" className="text-gray-300" size={32} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {mode !== 'memorize' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="ImageIcon" className="text-blue-600" size={24} />
                    <h4 className="text-xl font-bold">Выбери изображения:</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {availableImages.map((img, index) => (
                      <Button
                        key={index}
                        onClick={() => handleImageClick(img)}
                        disabled={showResult}
                        className="h-24 text-6xl bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-4 border-blue-300 hover:border-blue-500 transition-all duration-300 hover:scale-105"
                        variant="outline"
                      >
                        {img}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedAssociations.length === 3 && !showResult && mode !== 'memorize' && (
                  <Button
                    onClick={checkAnswer}
                    size="lg"
                    className="flex-1 text-lg h-14"
                  >
                    <Icon name="Check" className="mr-2" size={24} />
                    Проверить
                  </Button>
                )}

                {!showResult && mode !== 'memorize' && selectedAssociations.length < 3 && (
                  <Button
                    onClick={useHint}
                    variant="outline"
                    size="lg"
                    className="flex-1 text-lg h-14"
                  >
                    <Icon name="Lightbulb" className="mr-2" size={24} />
                    Подсказка ({3 - hintsUsed} осталось)
                  </Button>
                )}
              </div>

              {showResult && (
                <div className="mt-6 text-center animate-scale-in">
                  {selectedAssociations.every((img, i) => img === currentWord.associations[i]) ? (
                    <div>
                      <div className="text-4xl font-bold text-green-600 mb-3">
                        ✨ Отлично! Цепочка создана!
                      </div>
                      <p className="text-lg text-gray-600">
                        {mode === 'build' 
                          ? 'Сейчас запомним эту ассоциацию!' 
                          : 'Слово выучено! Переходим к следующему!'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl font-bold text-orange-600 mb-3">
                        💪 Попробуй ещё раз!
                      </div>
                      <p className="text-lg text-gray-600">
                        Правильная цепочка: {currentWord.associations.join(' → ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🌳</div>
                <h3 className="text-2xl font-heading font-bold">Дерево слов</h3>
              </div>

              <div className="bg-white rounded-2xl p-4 mb-4 min-h-[200px] border-4 border-dashed border-purple-300">
                <div className="grid grid-cols-4 gap-2">
                  {wordsLearned.map((word, index) => (
                    <div
                      key={index}
                      className="text-3xl animate-scale-in"
                      title={word}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      🌸
                    </div>
                  ))}
                  {wordsLearned.length === 0 && (
                    <div className="col-span-4 text-center text-gray-400 py-8 text-sm">
                      Дерево растёт<br />с каждым словом!
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 border-2 border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">Прогресс уровня:</span>
                    <span className="text-sm text-gray-600">
                      {currentWordIndex + 1}/{wordDatabase.filter(w => w.level === level).length}
                    </span>
                  </div>
                  <Progress 
                    value={((currentWordIndex + 1) / wordDatabase.filter(w => w.level === level).length) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 border-2 border-blue-300">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl">🦋</div>
                    <div>
                      <p className="text-xs font-bold text-blue-800">Ассоци говорит:</p>
                      <p className="text-xs text-blue-700">
                        {mode === 'build' 
                          ? 'Создай яркую цепочку образов!'
                          : mode === 'memorize'
                          ? 'Запоминай последовательность!'
                          : 'Вспомни ассоциацию!'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-100 rounded-xl p-3 border-2 border-yellow-300">
                  <div className="text-xs font-bold mb-2">📊 Статистика:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Выучено:</span>
                      <span className="font-bold">{wordsLearned.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ошибки:</span>
                      <span className="font-bold">{mistakes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Подсказки:</span>
                      <span className="font-bold">{hintsUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationGame;
