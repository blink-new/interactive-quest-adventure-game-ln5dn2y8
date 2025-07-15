import React from 'react';
import { GameCell } from '../types/game';

interface GameGridProps {
  grid: GameCell[][];
}

const GameGrid: React.FC<GameGridProps> = ({ grid }) => {
  const getCellContent = (cell: GameCell): string => {
    switch (cell.type) {
      case 'player':
        return '🧙‍♂️';
      case 'enemy':
        return '👹';
      case 'treasure':
        return '💎';
      case 'wall':
        return '🧱';
      case 'npc':
        return '👤';
      case 'exit':
        return '🚪';
      default:
        return '';
    }
  };

  const getCellClass = (cell: GameCell): string => {
    const baseClass = 'game-cell';
    switch (cell.type) {
      case 'player':
        return `${baseClass} player-cell`;
      case 'enemy':
        return `${baseClass} enemy-cell`;
      case 'treasure':
        return `${baseClass} treasure-cell`;
      case 'wall':
        return `${baseClass} wall-cell`;
      case 'npc':
        return `${baseClass} npc-cell`;
      case 'exit':
        return `${baseClass} exit-cell`;
      default:
        return `${baseClass} empty-cell`;
    }
  };

  return (
    <div className="game-grid">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={getCellClass(cell)}
          >
            {getCellContent(cell)}
          </div>
        ))
      )}
    </div>
  );
};

export default GameGrid;