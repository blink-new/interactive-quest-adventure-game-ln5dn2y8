import React from 'react';
import { Item } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, Sword, Shield, Potion, Gem, Key } from 'lucide-react';

interface InventoryProps {
  items: Item[];
  onUseItem: (item: Item) => void;
  onEquipItem: (item: Item) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onUseItem, onEquipItem }) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return <Sword className="w-4 h-4" />;
      case 'armor':
        return <Shield className="w-4 h-4" />;
      case 'potion':
        return <Potion className="w-4 h-4" />;
      case 'treasure':
        return <Gem className="w-4 h-4" />;
      case 'key':
        return <Key className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'weapon':
        return 'text-red-400';
      case 'armor':
        return 'text-blue-400';
      case 'potion':
        return 'text-green-400';
      case 'treasure':
        return 'text-yellow-400';
      case 'key':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-fantasy text-primary flex items-center gap-2">
          <Package className="w-5 h-5" />
          Inventory
          <Badge variant="secondary" className="ml-auto">
            {items.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Your inventory is empty
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <div className={`${getItemColor(item.type)}`}>
                  {getItemIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {item.name}
                    </h4>
                    {item.quantity && item.quantity > 1 && (
                      <Badge variant="outline" className="text-xs">
                        x{item.quantity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                  {item.stats && (
                    <div className="flex gap-2 mt-1">
                      {item.stats.attack && (
                        <span className="text-xs text-red-400">
                          +{item.stats.attack} ATK
                        </span>
                      )}
                      {item.stats.defense && (
                        <span className="text-xs text-blue-400">
                          +{item.stats.defense} DEF
                        </span>
                      )}
                      {item.stats.health && (
                        <span className="text-xs text-green-400">
                          +{item.stats.health} HP
                        </span>
                      )}
                      {item.stats.mana && (
                        <span className="text-xs text-blue-300">
                          +{item.stats.mana} MP
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {item.type === 'potion' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUseItem(item)}
                      className="text-xs h-6 px-2"
                    >
                      Use
                    </Button>
                  )}
                  {(item.type === 'weapon' || item.type === 'armor') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEquipItem(item)}
                      className="text-xs h-6 px-2"
                    >
                      Equip
                    </Button>
                  )}
                  <span className="text-xs text-accent text-center">
                    {item.value}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Inventory;