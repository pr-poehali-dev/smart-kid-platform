import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LogicGameProps {
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface MazeCell {
  x: number;
  y: number;
}

const LogicGame = ({ onComplete, onBack }: LogicGameProps) => {
  const [playerPos, setPlayerPos] = useState<MazeCell>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [collectedStars, setCollectedStars] = useState<string[]>([]);
  const [level, setLevel] = useState(1);

  const mazeSize = 5;
  const exitPos = { x: 4, y: 4 };
  const obstacles = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 1 },
    { x: 1, y: 3 }
  ];
  const stars = [
    { x: 1, y: 0 },
    { x: 2, y: 1 },
    { x: 3, y: 3 },
    { x: 0, y: 4 }
  ];

  const isObstacle = (x: number, y: number) => 
    obstacles.some(obs => obs.x === x && obs.y === y);

  const isStar = (x: number, y: number) => 
    stars.some(star => star.x === x && star.y === y);

  const isCollected = (x: number, y: number) =>
    collectedStars.includes(`${x}-${y}`);

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, playerPos.y - 1);
        break;
      case 'down':
        newY = Math.min(mazeSize - 1, playerPos.y + 1);
        break;
      case 'left':
        newX = Math.max(0, playerPos.x - 1);
        break;
      case 'right':
        newX = Math.min(mazeSize - 1, playerPos.x + 1);
        break;
    }

    if (!isObstacle(newX, newY)) {
      setPlayerPos({ x: newX, y: newY });

      if (isStar(newX, newY) && !isCollected(newX, newY)) {
        setCollectedStars(prev => [...prev, `${newX}-${newY}`]);
        setScore(prev => prev + 1);
      }

      if (newX === exitPos.x && newY === exitPos.y) {
        setTimeout(() => {
          onComplete(3);
        }, 500);
      }
    }
  };

  const handleReset = () => {
    setPlayerPos({ x: 0, y: 0 });
    setCollectedStars([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-400">
              <span className="text-lg font-bold">⭐ {collectedStars.length} / {stars.length}</span>
            </div>
          </div>
        </div>

        <Card className="p-8 bg-white shadow-2xl border-4 border-green-400">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-green-600 mb-2">
              Пройди лабиринт и собери звёзды! 🧩
            </h2>
            <p className="text-muted-foreground">Дойди до выхода, собрав все звёзды</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 mb-6">
            <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: mazeSize }).map((_, y) => (
                Array.from({ length: mazeSize }).map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl border-4 transition-all duration-300 ${
                      playerPos.x === x && playerPos.y === y
                        ? 'bg-blue-400 border-blue-600 scale-110 shadow-lg'
                        : isObstacle(x, y)
                        ? 'bg-gray-700 border-gray-800'
                        : x === exitPos.x && y === exitPos.y
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600 animate-pulse'
                        : isStar(x, y) && !isCollected(x, y)
                        ? 'bg-purple-100 border-purple-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {playerPos.x === x && playerPos.y === y ? (
                      '🐰'
                    ) : isObstacle(x, y) ? (
                      '🌲'
                    ) : x === exitPos.x && y === exitPos.y ? (
                      '🏁'
                    ) : isStar(x, y) && !isCollected(x, y) ? (
                      '⭐'
                    ) : null}
                  </div>
                ))
              ))}
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => handleMove('up')}
                size="lg"
                className="w-16 h-16 text-2xl bg-green-500 hover:bg-green-600"
              >
                ⬆️
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleMove('left')}
                  size="lg"
                  className="w-16 h-16 text-2xl bg-green-500 hover:bg-green-600"
                >
                  ⬅️
                </Button>
                <Button
                  onClick={() => handleMove('down')}
                  size="lg"
                  className="w-16 h-16 text-2xl bg-green-500 hover:bg-green-600"
                >
                  ⬇️
                </Button>
                <Button
                  onClick={() => handleMove('right')}
                  size="lg"
                  className="w-16 h-16 text-2xl bg-green-500 hover:bg-green-600"
                >
                  ➡️
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
              <Icon name="RotateCcw" size={20} />
              Начать заново
            </Button>
          </div>

          {playerPos.x === exitPos.x && playerPos.y === exitPos.y && (
            <div className="mt-6 text-center animate-scale-in">
              <Card className="p-6 bg-gradient-to-r from-green-400 to-emerald-400 text-white">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-3xl font-heading font-bold mb-2">Ура! Ты прошёл лабиринт!</h3>
                <p className="text-xl">Собрано звёзд: {collectedStars.length} из {stars.length}</p>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LogicGame;
