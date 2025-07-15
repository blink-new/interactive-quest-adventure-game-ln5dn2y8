import { Character, Enemy, Item, Quest, GameCell, Position, GameState } from '../types/game';

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 15;

export const createInitialPlayer = (): Character => ({
  id: 'player',
  name: 'Mr Ahmed',
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
  },
  // BOSS: Shadow Dragon
  {
    id: 'boss1',
    name: 'Shadow Dragon',
    health: 200,
    maxHealth: 200,
    attack: 25,
    defense: 8,
    position: { x: 18, y: 2 },
    experience: 150,
    gold: 100,
    isBoss: true,
    bossPhase: 1,
    maxPhases: 3,
    specialAbilities: [
      {
        id: 'fire_breath',
        name: 'Fire Breath',
        description: 'Unleashes devastating flames',
        damage: 35,
        cooldown: 3,
        currentCooldown: 0
      },
      {
        id: 'shadow_heal',
        name: 'Shadow Regeneration',
        description: 'Heals using dark magic',
        effect: 'heal',
        cooldown: 4,
        currentCooldown: 0
      },
      {
        id: 'rage_mode',
        name: 'Draconic Rage',
        description: 'Enters a berserker state',
        effect: 'rage',
        cooldown: 5,
        currentCooldown: 0
      }
    ],
    loot: [
      { id: 'dragon_sword', name: 'Dragonslayer Blade', type: 'weapon', description: 'A legendary sword forged from dragon scales', value: 200, stats: { attack: 20 } },
      { id: 'dragon_armor', name: 'Dragon Scale Armor', type: 'armor', description: 'Armor crafted from ancient dragon scales', value: 250, stats: { defense: 15 } },
      { id: 'boss_potion', name: 'Dragon\'s Elixir', type: 'potion', description: 'Permanently increases max health', value: 100, stats: { health: 100 }, quantity: 1 }
    ]
  },
  // BOSS: Lich King
  {
    id: 'boss2',
    name: 'Lich King',
    health: 180,
    maxHealth: 180,
    attack: 22,
    defense: 10,
    position: { x: 2, y: 13 },
    experience: 120,
    gold: 80,
    isBoss: true,
    bossPhase: 1,
    maxPhases: 2,
    specialAbilities: [
      {
        id: 'death_bolt',
        name: 'Death Bolt',
        description: 'Fires a bolt of necrotic energy',
        damage: 30,
        cooldown: 2,
        currentCooldown: 0
      },
      {
        id: 'life_drain',
        name: 'Life Drain',
        description: 'Drains life force to heal',
        damage: 20,
        effect: 'heal',
        cooldown: 4,
        currentCooldown: 0
      },
      {
        id: 'summon_undead',
        name: 'Summon Undead',
        description: 'Raises skeletal minions',
        effect: 'buff',
        cooldown: 6,
        currentCooldown: 0
      }
    ],
    loot: [
      { id: 'lich_staff', name: 'Staff of Necromancy', type: 'weapon', description: 'A staff pulsing with dark magic', value: 180, stats: { attack: 18 } },
      { id: 'lich_robe', name: 'Robes of the Undead', type: 'armor', description: 'Dark robes that whisper ancient secrets', value: 200, stats: { defense: 12 } }
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
  },
  {
    id: 'boss1_quest',
    title: 'Dragonslayer',
    description: 'Face the mighty Shadow Dragon and prove your worth as a true hero',
    objectives: [
      {
        id: 'obj3',
        description: 'Defeat the Shadow Dragon',
        type: 'kill',
        target: 'boss1',
        current: 0,
        required: 1,
        completed: false
      }
    ],
    rewards: {
      experience: 300,
      gold: 500,
      items: [
        { id: 'dragon_title', name: 'Dragonslayer Title', type: 'treasure', description: 'A legendary title proving your dragon-slaying prowess', value: 1000 }
      ]
    },
    status: 'active',
    isMainQuest: true
  },
  {
    id: 'boss2_quest',
    title: 'Undead Nemesis',
    description: 'Banish the Lich King back to the realm of the dead',
    objectives: [
      {
        id: 'obj4',
        description: 'Defeat the Lich King',
        type: 'kill',
        target: 'boss2',
        current: 0,
        required: 1,
        completed: false
      }
    ],
    rewards: {
      experience: 250,
      gold: 400,
      items: [
        { id: 'lich_bane', name: 'Lich Bane Amulet', type: 'treasure', description: 'An amulet that protects against undead magic', value: 800 }
      ]
    },
    status: 'active',
    isMainQuest: true
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

export const executeBossAbility = (boss: Enemy): { ability: any; damage: number; effect: string } => {
  if (!boss.isBoss || !boss.specialAbilities) {
    return { ability: null, damage: 0, effect: '' };
  }

  // Find available abilities (not on cooldown)
  const availableAbilities = boss.specialAbilities.filter(ability => ability.currentCooldown === 0);
  
  if (availableAbilities.length === 0) {
    return { ability: null, damage: 0, effect: '' };
  }

  // Select random available ability
  const selectedAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
  
  // Set cooldown
  selectedAbility.currentCooldown = selectedAbility.cooldown;
  
  let damage = 0;
  let effect = '';

  switch (selectedAbility.id) {
    case 'fire_breath': {
      damage = selectedAbility.damage || 35;
      effect = `${boss.name} breathes devastating fire!`;
      break;
    }
    case 'shadow_heal': {
      const healAmount = 40;
      boss.health = Math.min(boss.maxHealth, boss.health + healAmount);
      effect = `${boss.name} regenerates ${healAmount} health with shadow magic!`;
      break;
    }
    case 'rage_mode': {
      boss.attack += 10;
      effect = `${boss.name} enters a berserker rage! Attack increased!`;
      break;
    }
    case 'death_bolt': {
      damage = selectedAbility.damage || 30;
      effect = `${boss.name} fires a bolt of necrotic energy!`;
      break;
    }
    case 'life_drain': {
      damage = selectedAbility.damage || 20;
      const drainHeal = Math.floor(damage * 0.8);
      boss.health = Math.min(boss.maxHealth, boss.health + drainHeal);
      effect = `${boss.name} drains your life force and heals for ${drainHeal}!`;
      break;
    }
    case 'summon_undead': {
      boss.attack += 5;
      boss.defense += 3;
      effect = `${boss.name} summons undead minions to aid in battle!`;
      break;
    }
    default: {
      damage = selectedAbility.damage || 0;
      effect = `${boss.name} uses ${selectedAbility.name}!`;
    }
  }

  return { ability: selectedAbility, damage, effect };
};

export const updateBossCooldowns = (boss: Enemy): Enemy => {
  if (!boss.isBoss || !boss.specialAbilities) return boss;

  const updatedBoss = { ...boss };
  updatedBoss.specialAbilities = boss.specialAbilities.map(ability => ({
    ...ability,
    currentCooldown: Math.max(0, ability.currentCooldown - 1)
  }));

  return updatedBoss;
};

export const checkBossPhaseTransition = (boss: Enemy): Enemy => {
  if (!boss.isBoss || !boss.maxPhases || !boss.bossPhase) return boss;

  const healthPercentage = (boss.health / boss.maxHealth) * 100;
  const updatedBoss = { ...boss };

  // Phase transitions at 66% and 33% health
  if (healthPercentage <= 66 && boss.bossPhase === 1) {
    updatedBoss.bossPhase = 2;
    updatedBoss.attack += 5;
    updatedBoss.defense += 2;
    // Reset all ability cooldowns for phase transition
    if (updatedBoss.specialAbilities) {
      updatedBoss.specialAbilities = updatedBoss.specialAbilities.map(ability => ({
        ...ability,
        currentCooldown: 0
      }));
    }
  } else if (healthPercentage <= 33 && boss.bossPhase === 2 && boss.maxPhases >= 3) {
    updatedBoss.bossPhase = 3;
    updatedBoss.attack += 8;
    updatedBoss.defense += 3;
    // Reset all ability cooldowns for final phase
    if (updatedBoss.specialAbilities) {
      updatedBoss.specialAbilities = updatedBoss.specialAbilities.map(ability => ({
        ...ability,
        currentCooldown: Math.max(0, ability.cooldown - 1) // Reduced cooldowns in final phase
      }));
    }
  }

  return updatedBoss;
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

export const consumeItem = (player: Character, item: Item): Character => {
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