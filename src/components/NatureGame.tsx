import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';

interface NatureGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface Animal {
  name: string;
  emoji: string;
  sound: string;
  habitat: string;
  food: string;
}

const animals: Animal[] = [
  { name: 'Лев', emoji: '🦁', sound: 'Рычит', habitat: 'Саванна', food: 'Мясо' },
  { name: 'Слон', emoji: '🐘', sound: 'Трубит', habitat: 'Саванна', food: 'Трава' },
  { name: 'Дельфин', emoji: '🐬', sound: 'Свистит', habitat: 'Океан', food: 'Рыба' },
  { name: 'Медведь', emoji: '🐻', sound: 'Рычит', habitat: 'Лес', food: 'Мёд' },
  { name: 'Пингвин', emoji: '🐧', sound: 'Кричит', habitat: 'Антарктида', food: 'Рыба' }
];

const habitats = [
  { name: 'Саванна', emoji: '🌾', color: 'from-yellow-300 to-orange-300' },
  { name: 'Океан', emoji: '🌊', color: 'from-blue-300 to-cyan-300' },
  { name: 'Лес', emoji: '🌲', color: 'from-green-300 to-emerald-300' },
  { name: 'Антарктида', emoji: '❄️', color: 'from-blue-100 to-white' }
];

const NatureGame = ({ onComplete, onBack }: NatureGameProps) => {
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameMode, setGameMode] = useState<'habitat' | 'quiz'>('habitat');

  const currentAnimal = animals[currentAnimalIndex];

  const handleHabitatSelect = (habitat: string) => {
    setSelectedHabitat(habitat);
    setShowResult(true);

    const isCorrect = habitat === currentAnimal.habitat;
    
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
    } else {
      soundManager.playWrong();
    }

    setTimeout(() => {
      if (currentAnimalIndex + 1 < animals.length) {
        setCurrentAnimalIndex(prev => prev + 1);
        setSelectedHabitat(null);
        setShowResult(false);
      } else {
        soundManager.playComplete();
        onComplete(3);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex gap-2">
            {animals.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < score ? 'bg-yellow-400' : i === currentAnimalIndex ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                {i < score ? '⭐' : ''}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-12 bg-white shadow-2xl border-4 border-green-400">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-green-600 mb-2">
              Помоги животным найти свой дом! 🌿
            </h2>
            <p className="text-muted-foreground">Выбери правильную среду обитания</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl p-12 mb-8">
            <div className="text-center mb-12">
              <div className="text-9xl mb-6 animate-bounce-gentle">{currentAnimal.emoji}</div>
              <h3 className="text-4xl font-bold text-gray-800 mb-3">{currentAnimal.name}</h3>
              <div className="flex justify-center gap-4 text-lg text-gray-600">
                <span>🔊 {currentAnimal.sound}</span>
                <span>•</span>
                <span>🍽️ {currentAnimal.food}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {habitats.map((habitat) => (
                <Button
                  key={habitat.name}
                  onClick={() => handleHabitatSelect(habitat.name)}
                  disabled={showResult}
                  className={`h-32 text-2xl font-bold bg-gradient-to-br ${habitat.color} hover:scale-105 transition-all duration-300 ${
                    showResult && habitat.name === currentAnimal.habitat
                      ? 'ring-4 ring-green-500 scale-110'
                      : showResult && habitat.name === selectedHabitat
                      ? 'ring-4 ring-red-500'
                      : ''
                  }`}
                  variant="outline"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-5xl">{habitat.emoji}</span>
                    <span className="text-xl">{habitat.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="text-center animate-scale-in">
              {selectedHabitat === currentAnimal.habitat ? (
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-3">
                    🎉 Отлично! {currentAnimal.name} дома!
                  </div>
                  <p className="text-lg text-gray-600">
                    {currentAnimal.name} живёт в среде {currentAnimal.habitat} и питается {currentAnimal.food}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-3">
                    💪 Попробуй ещё раз!
                  </div>
                  <p className="text-lg text-gray-600">
                    {currentAnimal.name} живёт в среде {currentAnimal.habitat}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {score >= animals.length && (
          <Card className="mt-6 p-8 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-3xl font-heading font-bold mb-2">Браво!</h3>
            <p className="text-xl">Ты помог всем животным найти дом! Получай 3 звезды!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NatureGame;