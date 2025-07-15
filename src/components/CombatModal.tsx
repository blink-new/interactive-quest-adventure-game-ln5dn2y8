import React, { useState, useEffect } from 'react';
import { Character, Enemy } from '../types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sword, Shield, Heart, Zap } from 'lucide-react';

interface CombatModalProps {
  isOpen: boolean;
  player: Character;
  enemy: Enemy;
  onAttack: () => void;
  onDefend: () => void;
  onFlee: () => void;
  onClose: () => void;
  combatLog: string[];
  isPlayerTurn: boolean;
}

const CombatModal: React.FC<CombatModalProps> = ({
  isOpen,
  player,
  enemy,
  onAttack,
  onDefend,
  onFlee,
  onClose,
  combatLog,
  isPlayerTurn
}) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!isPlayerTurn) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn]);

  const playerHealthPercentage = (player.health / player.maxHealth) * 100;
  const enemyHealthPercentage = (enemy.health / enemy.maxHealth) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-fantasy text-primary text-center text-xl">
            Combat: {player.name} vs {enemy.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Combat Arena */}
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Player */}
            <div className="text-center space-y-3">
              <div className={`text-6xl transition-transform duration-300 ${animating && isPlayerTurn ? 'scale-110' : ''}`}>
                🧙‍♂️
              </div>
              <div>
                <h3 className="font-fantasy text-lg text-primary">{player.name}</h3>
                <p className="text-sm text-muted-foreground">Level {player.level}</p>
              </div>
              
              {/* Player Health */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Health</span>
                  </div>
                  <span>{player.health}/{player.maxHealth}</span>
                </div>
                <Progress value={playerHealthPercentage} className="h-2" />
              </div>

              {/* Player Mana */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Mana</span>
                  </div>
                  <span>{player.mana}/{player.maxMana}</span>
                </div>
                <Progress value={(player.mana / player.maxMana) * 100} className="h-2" />
              </div>

              {/* Player Stats */}
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3 text-accent" />
                  <span>{player.attack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  <span>{player.defense}</span>
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-primary/20 rounded-full p-3">
                <span className="font-fantasy text-primary font-bold">VS</span>
              </div>
            </div>

            {/* Enemy */}
            <div className="text-center space-y-3">
              <div className={`text-6xl transition-transform duration-300 ${animating && !isPlayerTurn ? 'scale-110' : ''}`}>
                👹
              </div>
              <div>
                <h3 className="font-fantasy text-lg text-red-400">{enemy.name}</h3>
              </div>
              
              {/* Enemy Health */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Health</span>
                  </div>
                  <span>{enemy.health}/{enemy.maxHealth}</span>
                </div>
                <Progress value={enemyHealthPercentage} className="h-2" />
              </div>

              {/* Enemy Stats */}
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3 text-red-400" />
                  <span>{enemy.attack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>{enemy.defense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Log */}
          <div className="bg-secondary/20 rounded-lg p-4 max-h-32 overflow-y-auto">
            <h4 className="font-medium text-sm mb-2">Combat Log</h4>
            <div className="space-y-1 text-xs">
              {combatLog.slice(-5).map((log, index) => (
                <p key={index} className="text-muted-foreground">
                  {log}
                </p>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={onAttack}
              disabled={!isPlayerTurn || player.health <= 0}
              className="flex items-center gap-2"
            >
              <Sword className="w-4 h-4" />
              Attack
            </Button>
            <Button
              variant="outline"
              onClick={onDefend}
              disabled={!isPlayerTurn || player.health <= 0}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Defend
            </Button>
            <Button
              variant="secondary"
              onClick={onFlee}
              disabled={!isPlayerTurn}
              className="flex items-center gap-2"
            >
              Flee
            </Button>
          </div>

          {/* Turn Indicator */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {player.health <= 0 ? (
                <span className="text-red-400">You have been defeated!</span>
              ) : enemy.health <= 0 ? (
                <span className="text-green-400">Victory! Enemy defeated!</span>
              ) : isPlayerTurn ? (
                <span className="text-primary">Your turn</span>
              ) : (
                <span className="text-red-400">Enemy's turn...</span>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CombatModal;