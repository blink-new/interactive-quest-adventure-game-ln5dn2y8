export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  experienceToNext: number;
  attack: number;
  defense: number;
  position: Position;
  inventory: Item[];
  equipment: Equipment;
  gold: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'treasure' | 'key';
  description: string;
  value: number;
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
  quantity?: number;
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  position: Position;
  experience: number;
  gold: number;
  loot: Item[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: {
    experience: number;
    gold: number;
    items: Item[];
  };
  status: 'available' | 'active' | 'completed';
  isMainQuest: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'reach' | 'talk';
  target: string;
  current: number;
  required: number;
  completed: boolean;
}

export interface GameCell {
  type: 'empty' | 'wall' | 'player' | 'enemy' | 'treasure' | 'npc' | 'exit';
  content?: Enemy | Item | string;
  position: Position;
}

export interface GameState {
  player: Character;
  enemies: Enemy[];
  items: Item[];
  quests: Quest[];
  currentLevel: number;
  gameGrid: GameCell[][];
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'victory';
  message: string;
}