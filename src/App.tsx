import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Character, Enemy, Item, Position, GameCell } from './types/game';
import { useKeyboard } from './hooks/useKeyboard';
import {
  createInitialPlayer,
  createInitialEnemies,
  createInitialItems,
  createInitialQuests,
  generateGameGrid,
  canMoveTo,
  calculateDamage,
  gainExperience,
  useItem,
  equipItem,
  GRID_WIDTH,
  GRID_HEIGHT
} from './utils/gameLogic';

import GameGrid from './components/GameGrid';
import CharacterStats from './components/CharacterStats';
import Inventory from './components/Inventory';
import QuestLog from './components/QuestLog';
import CombatModal from './components/CombatModal';
import GameControls from './components/GameControls';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Crown, Gamepad2, RotateCcw } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    player: createInitialPlayer(),
    enemies: createInitialEnemies(),
    items: createInitialItems(),
    quests: createInitialQuests(),
    currentLevel: 1,
    gameGrid: [],
    gameStatus: 'playing',
    message: 'Welcome to the Quest Adventure! Use WASD keys to move around.'
  }));

  const [showInventory, setShowInventory] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [combatState, setCombatState] = useState<{
    isActive: boolean;
    enemy: Enemy | null;
    isPlayerTurn: boolean;
    combatLog: string[];
  }>({
    isActive: false,
    enemy: null,
    isPlayerTurn: true,
    combatLog: []
  });

  // Initialize game grid
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      gameGrid: generateGameGrid(prev.player, prev.enemies, prev.items)
    }));
  }, []);

  // Update grid when game state changes
  useEffect(() => {
    if (gameState.player && gameState.enemies && gameState.items) {
      setGameState(prev => ({
        ...prev,
        gameGrid: generateGameGrid(prev.player, prev.enemies, prev.items)
      }));
    }
  }, [gameState.player.position, gameState.enemies, gameState.items]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameStatus !== 'playing' || combatState.isActive) return;

    const newPosition: Position = { ...gameState.player.position };
    
    switch (direction) {
      case 'up':
        newPosition.y -= 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
    }

    if (!canMoveTo(newPosition, gameState.gameGrid)) {
      setGameState(prev => ({ ...prev, message: 'Cannot move there!' }));
      return;
    }

    // Check for interactions at new position
    const targetCell = gameState.gameGrid[newPosition.y]?.[newPosition.x];
    
    if (targetCell?.type === 'enemy' && targetCell.content) {
      // Start combat
      const enemy = targetCell.content as Enemy;
      setCombatState({
        isActive: true,
        enemy,
        isPlayerTurn: true,
        combatLog: [`Combat started with ${enemy.name}!`]
      });
      return;
    }

    if (targetCell?.type === 'treasure' && targetCell.content) {
      // Collect item
      const item = targetCell.content as Item;
      setGameState(prev => {
        const newPlayer = { ...prev.player };
        newPlayer.inventory.push(item);
        newPlayer.gold += item.value;
        
        // Update quests
        const updatedQuests = prev.quests.map(quest => {
          const updatedObjectives = quest.objectives.map(obj => {
            if (obj.type === 'collect' && obj.target === item.id) {
              return { ...obj, current: obj.current + 1, completed: obj.current + 1 >= obj.required };
            }
            return obj;
          });
          
          const allCompleted = updatedObjectives.every(obj => obj.completed);
          return {
            ...quest,
            objectives: updatedObjectives,
            status: allCompleted ? 'completed' as const : quest.status
          };
        });

        return {
          ...prev,
          player: { ...newPlayer, position: newPosition },
          items: prev.items.filter(i => i.id !== item.id),
          quests: updatedQuests,
          message: `Found ${item.name}! +${item.value} gold`
        };
      });
      return;
    }

    // Normal movement
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, position: newPosition },
      message: 'Moved successfully.'
    }));
  }, [gameState, combatState.isActive]);

  const handleAction = useCallback(() => {
    if (combatState.isActive) return;
    
    setGameState(prev => ({
      ...prev,
      message: 'No action available here.'
    }));
  }, [combatState.isActive]);

  const handleCombatAction = useCallback((action: 'attack' | 'defend' | 'flee') => {
    if (!combatState.enemy || !combatState.isPlayerTurn) return;

    setCombatState(prev => {
      const newLog = [...prev.combatLog];
      let newIsPlayerTurn = false;
      
      if (action === 'attack') {
        const damage = calculateDamage(gameState.player, prev.enemy!);
        prev.enemy!.health -= damage;
        newLog.push(`You attack ${prev.enemy!.name} for ${damage} damage!`);
        
        if (prev.enemy!.health <= 0) {
          // Enemy defeated
          newLog.push(`${prev.enemy!.name} defeated!`);
          
          setGameState(gameState => {
            const newPlayer = gainExperience(gameState.player, prev.enemy!.experience);
            newPlayer.gold += prev.enemy!.gold;
            
            // Add loot to inventory
            prev.enemy!.loot.forEach(item => {
              newPlayer.inventory.push(item);
            });
            
            // Update kill quests
            const updatedQuests = gameState.quests.map(quest => {
              const updatedObjectives = quest.objectives.map(obj => {
                if (obj.type === 'kill' && (obj.target === 'any' || obj.target === prev.enemy!.id)) {
                  return { ...obj, current: obj.current + 1, completed: obj.current + 1 >= obj.required };
                }
                return obj;
              });
              
              const allCompleted = updatedObjectives.every(obj => obj.completed);
              return {
                ...quest,
                objectives: updatedObjectives,
                status: allCompleted ? 'completed' as const : quest.status
              };
            });
            
            return {
              ...gameState,
              player: newPlayer,
              enemies: gameState.enemies.filter(e => e.id !== prev.enemy!.id),
              quests: updatedQuests,
              message: `Defeated ${prev.enemy!.name}! Gained ${prev.enemy!.experience} XP and ${prev.enemy!.gold} gold.`
            };
          });
          
          return {
            isActive: false,
            enemy: null,
            isPlayerTurn: true,
            combatLog: []
          };
        }
      } else if (action === 'defend') {
        newLog.push('You raise your guard!');
      } else if (action === 'flee') {
        newLog.push('You flee from combat!');
        return {
          isActive: false,
          enemy: null,
          isPlayerTurn: true,
          combatLog: []
        };
      }

      return {
        ...prev,
        combatLog: newLog,
        isPlayerTurn: newIsPlayerTurn
      };
    });

    // Enemy turn after a delay
    if (action !== 'flee' && combatState.enemy && combatState.enemy.health > 0) {
      setTimeout(() => {
        setCombatState(prev => {
          if (!prev.enemy || prev.enemy.health <= 0) return prev;
          
          const damage = calculateDamage(prev.enemy, gameState.player);
          const newLog = [...prev.combatLog, `${prev.enemy.name} attacks you for ${damage} damage!`];
          
          setGameState(gameState => {
            const newPlayer = { ...gameState.player };
            newPlayer.health -= damage;
            
            if (newPlayer.health <= 0) {
              newPlayer.health = 0;
              newLog.push('You have been defeated!');
            }
            
            return {
              ...gameState,
              player: newPlayer,
              message: newPlayer.health <= 0 ? 'Game Over!' : `Took ${damage} damage!`
            };
          });
          
          return {
            ...prev,
            combatLog: newLog,
            isPlayerTurn: true
          };
        });
      }, 1000);
    }
  }, [combatState, gameState.player]);

  const handleUseItem = useCallback((item: Item) => {
    setGameState(prev => ({
      ...prev,
      player: useItem(prev.player, item),
      message: `Used ${item.name}!`
    }));
  }, []);

  const handleEquipItem = useCallback((item: Item) => {
    setGameState(prev => ({
      ...prev,
      player: equipItem(prev.player, item),
      message: `Equipped ${item.name}!`
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      player: createInitialPlayer(),
      enemies: createInitialEnemies(),
      items: createInitialItems(),
      quests: createInitialQuests(),
      currentLevel: 1,
      gameGrid: [],
      gameStatus: 'playing',
      message: 'Game reset! Welcome back to the adventure!'
    });
    setCombatState({
      isActive: false,
      enemy: null,
      isPlayerTurn: true,
      combatLog: []
    });
    setShowInventory(false);
    setShowQuests(false);
  }, []);

  // Keyboard controls
  useKeyboard({
    onMoveUp: () => movePlayer('up'),
    onMoveDown: () => movePlayer('down'),
    onMoveLeft: () => movePlayer('left'),
    onMoveRight: () => movePlayer('right'),
    onAction: handleAction,
    onInventory: () => setShowInventory(!showInventory),
    onQuests: () => setShowQuests(!showQuests)
  });

  const completedQuests = gameState.quests.filter(q => q.status === 'completed');
  const isVictory = completedQuests.some(q => q.isMainQuest);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-accent" />
                <div>
                  <CardTitle className="font-fantasy text-2xl text-primary">
                    Quest Adventure
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Level {gameState.currentLevel} • {gameState.enemies.length} enemies remaining
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isVictory && (
                  <Badge className="bg-accent text-accent-foreground">
                    Victory!
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGame}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Game
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                {gameState.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Character & Controls */}
          <div className="lg:col-span-1 space-y-4">
            <CharacterStats character={gameState.player} />
            <GameControls
              onMove={movePlayer}
              onAction={handleAction}
              onToggleInventory={() => setShowInventory(!showInventory)}
              onToggleQuests={() => setShowQuests(!showQuests)}
              showInventory={showInventory}
              showQuests={showQuests}
            />
          </div>

          {/* Center - Game Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="font-fantasy text-primary text-center">
                  Dungeon Level {gameState.currentLevel}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <GameGrid grid={gameState.gameGrid} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Inventory & Quests */}
          <div className="lg:col-span-1">
            <Tabs value={showInventory ? 'inventory' : showQuests ? 'quests' : 'inventory'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="inventory" 
                  onClick={() => {
                    setShowInventory(true);
                    setShowQuests(false);
                  }}
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger 
                  value="quests"
                  onClick={() => {
                    setShowQuests(true);
                    setShowInventory(false);
                  }}
                >
                  Quests
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="mt-4">
                <Inventory
                  items={gameState.player.inventory}
                  onUseItem={handleUseItem}
                  onEquipItem={handleEquipItem}
                />
              </TabsContent>
              
              <TabsContent value="quests" className="mt-4">
                <QuestLog quests={gameState.quests} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Combat Modal */}
        <CombatModal
          isOpen={combatState.isActive}
          player={gameState.player}
          enemy={combatState.enemy!}
          onAttack={() => handleCombatAction('attack')}
          onDefend={() => handleCombatAction('defend')}
          onFlee={() => handleCombatAction('flee')}
          onClose={() => setCombatState(prev => ({ ...prev, isActive: false }))}
          combatLog={combatState.combatLog}
          isPlayerTurn={combatState.isPlayerTurn}
        />
      </div>
    </div>
  );
}

export default App;