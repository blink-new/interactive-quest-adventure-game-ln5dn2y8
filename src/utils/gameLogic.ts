import { Character, Enemy, Item, Quest, GameCell, Position, GameState } from '../types/game';

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 15;

export const createInitialPlayer = (): Character => ({
  id: 'player',
  name: 'Hero',
  level: 1,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  experience: 0,
  experienceToNext: 100,
  attack: 15,
  defense: 5,
  position: { x: 1, y: 1 },
  inventory: [],
  equipment: {},
  gold: 50
});

export const createInitialEnemies = (): Enemy[] => [
  {
    id: 'goblin1',
    name: 'Goblin Warrior',
    health: 40,
    maxHealth: 40,
    attack: 8,
    defense: 2,
    position: { x: 15, y: 8 },
    experience: 25,
    gold: 15,
    loot: [
      { id: 'sword1', name: 'Rusty Sword', type: 'weapon', description: 'A worn but functional sword', value: 25, stats: { attack: 5 } }
    ]
  },
  {
    id: 'orc1',
    name: 'Orc Brute',
    health: 60,
    maxHealth: 60,
    attack: 12,
    defense: 4,
    position: { x: 10, y: 12 },
    experience: 40,
    gold: 25,
    loot: [
      { id: 'armor1', name: 'Leather Armor', type: 'armor', description: 'Basic protection', value: 40, stats: { defense: 8 } }
    ]
  },
  {
    id: 'skeleton1',
    name: 'Skeleton Archer',
    health: 35,
    maxHealth: 35,
    attack: 10,
    defense: 1,
    position: { x: 5, y: 10 },
    experience: 30,
    gold: 20,
    loot: [
      { id: 'potion1', name: 'Health Potion', type: 'potion', description: 'Restores 50 HP', value: 30, stats: { health: 50 }, quantity: 1 }
    ]
  }
];

export const createInitialItems = (): Item[] => [
  {
    id: 'treasure1',
    name: 'Golden Chalice',
    type: 'treasure',
    description: 'A valuable golden chalice',
    value: 100
  },
  {
    id: 'key1',
    name: 'Ancient Key',
    type: 'key',
    description: 'Opens mysterious doors',
    value: 0
  },
  {
    id: 'potion2',
    name: 'Mana Potion',
    type: 'potion',
    description: 'Restores 30 MP',
    value: 25,
    stats: { mana: 30 },
    quantity: 1
  }
];

export const createInitialQuests = (): Quest[] => [
  {
    id: 'main1',
    title: 'The Ancient Treasure',
    description: 'Find the legendary treasure hidden in the dungeon',
    objectives: [
      {
        id: 'obj1',
        description: 'Collect the Golden Chalice',
        type: 'collect',
        target: 'treasure1',
        current: 0,
        required: 1,
        completed: false
      }
    ],
    rewards: {
      experience: 100,
      gold: 200,
      items: []
    },
    status: 'active',
    isMainQuest: true
  },
  {
    id: 'side1',
    title: 'Monster Hunter',
    description: 'Defeat the creatures lurking in the shadows',
    objectives: [
      {
        id: 'obj2',
        description: 'Defeat 3 enemies',
        type: 'kill',
        target: 'any',
        current: 0,
        required: 3,
        completed: false
      }
    ],
    rewards: {
      experience: 75,
      gold: 100,
      items: [
        { id: 'reward1', name: 'Steel Sword', type: 'weapon', description: 'A sharp steel blade', value: 75, stats: { attack: 12 } }
      ]
    },
    status: 'active',
    isMainQuest: false
  }
];

export const generateGameGrid = (player: Character, enemies: Enemy[], items: Item[]): GameCell[][] => {
  const grid: GameCell[][] = [];
  
  // Initialize empty grid
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = {
        type: 'empty',
        position: { x, y }
      };
    }
  }
  
  // Add walls around the border
  for (let x = 0; x < GRID_WIDTH; x++) {
    grid[0][x] = { type: 'wall', position: { x, y: 0 } };
    grid[GRID_HEIGHT - 1][x] = { type: 'wall', position: { x, y: GRID_HEIGHT - 1 } };
  }
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y][0] = { type: 'wall', position: { x: 0, y } };
    grid[y][GRID_WIDTH - 1] = { type: 'wall', position: { x: GRID_WIDTH - 1, y } };
  }
  
  // Add some internal walls for maze-like structure
  const wallPositions = [
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
    { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 },
    { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 },
    { x: 15, y: 10 }, { x: 15, y: 11 }, { x: 15, y: 12 }
  ];
  
  wallPositions.forEach(pos => {
    if (pos.x > 0 && pos.x < GRID_WIDTH - 1 && pos.y > 0 && pos.y < GRID_HEIGHT - 1) {
      grid[pos.y][pos.x] = { type: 'wall', position: pos };
    }
  });
  
  // Place player
  grid[player.position.y][player.position.x] = {
    type: 'player',
    position: player.position
  };
  
  // Place enemies
  enemies.forEach(enemy => {
    if (grid[enemy.position.y] && grid[enemy.position.y][enemy.position.x]) {
      grid[enemy.position.y][enemy.position.x] = {
        type: 'enemy',
        content: enemy,
        position: enemy.position
      };
    }
  });
  
  // Place items
  const itemPositions = [
    { x: 18, y: 13, item: items[0] }, // treasure
    { x: 3, y: 8, item: items[1] },   // key
    { x: 16, y: 5, item: items[2] }   // mana potion
  ];
  
  itemPositions.forEach(({ x, y, item }) => {
    if (grid[y] && grid[y][x] && grid[y][x].type === 'empty') {
      grid[y][x] = {
        type: 'treasure',
        content: item,
        position: { x, y }
      };
    }
  });
  
  return grid;
};

export const canMoveTo = (position: Position, grid: GameCell[][]): boolean => {
  if (position.x < 0 || position.x >= GRID_WIDTH || position.y < 0 || position.y >= GRID_HEIGHT) {
    return false;
  }
  
  const cell = grid[position.y][position.x];
  return cell.type !== 'wall';
};

export const calculateDamage = (attacker: Character | Enemy, defender: Character | Enemy): number => {
  const baseDamage = attacker.attack;
  const defense = defender.defense;
  const damage = Math.max(1, baseDamage - defense + Math.floor(Math.random() * 5));
  return damage;
};

export const gainExperience = (player: Character, amount: number): Character => {
  const newPlayer = { ...player };
  newPlayer.experience += amount;
  
  // Check for level up
  while (newPlayer.experience >= newPlayer.experienceToNext) {
    newPlayer.experience -= newPlayer.experienceToNext;
    newPlayer.level += 1;
    newPlayer.maxHealth += 20;
    newPlayer.maxMana += 10;
    newPlayer.health = newPlayer.maxHealth; // Full heal on level up
    newPlayer.mana = newPlayer.maxMana;
    newPlayer.attack += 3;
    newPlayer.defense += 2;
    newPlayer.experienceToNext = Math.floor(newPlayer.experienceToNext * 1.5);
  }
  
  return newPlayer;
};

export const useItem = (player: Character, item: Item): Character => {
  const newPlayer = { ...player };
  
  if (item.type === 'potion' && item.stats) {
    if (item.stats.health) {
      newPlayer.health = Math.min(newPlayer.maxHealth, newPlayer.health + item.stats.health);
    }
    if (item.stats.mana) {
      newPlayer.mana = Math.min(newPlayer.maxMana, newPlayer.mana + item.stats.mana);
    }
    
    // Remove item from inventory
    const itemIndex = newPlayer.inventory.findIndex(invItem => invItem.id === item.id);
    if (itemIndex !== -1) {
      if (newPlayer.inventory[itemIndex].quantity && newPlayer.inventory[itemIndex].quantity! > 1) {
        newPlayer.inventory[itemIndex].quantity! -= 1;
      } else {
        newPlayer.inventory.splice(itemIndex, 1);
      }
    }
  }
  
  return newPlayer;
};

export const equipItem = (player: Character, item: Item): Character => {
  const newPlayer = { ...player };
  
  if (item.type === 'weapon') {
    // Unequip current weapon
    if (newPlayer.equipment.weapon) {
      newPlayer.inventory.push(newPlayer.equipment.weapon);
    }
    newPlayer.equipment.weapon = item;
    
    // Remove from inventory
    const itemIndex = newPlayer.inventory.findIndex(invItem => invItem.id === item.id);
    if (itemIndex !== -1) {
      newPlayer.inventory.splice(itemIndex, 1);
    }
    
    // Apply stats
    if (item.stats?.attack) {
      newPlayer.attack += item.stats.attack;
    }
  } else if (item.type === 'armor') {
    // Unequip current armor
    if (newPlayer.equipment.armor) {
      newPlayer.inventory.push(newPlayer.equipment.armor);
    }
    newPlayer.equipment.armor = item;
    
    // Remove from inventory
    const itemIndex = newPlayer.inventory.findIndex(invItem => invItem.id === item.id);
    if (itemIndex !== -1) {
      newPlayer.inventory.splice(itemIndex, 1);
    }
    
    // Apply stats
    if (item.stats?.defense) {
      newPlayer.defense += item.stats.defense;
    }
  }
  
  return newPlayer;
};