import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Sword, 
  Package, 
  ScrollText,
  Keyboard
} from 'lucide-react';

interface GameControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onAction: () => void;
  onToggleInventory: () => void;
  onToggleQuests: () => void;
  showInventory: boolean;
  showQuests: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  onAction,
  onToggleInventory,
  onToggleQuests,
  showInventory,
  showQuests
}) => {
  return (
    <div className="space-y-4">
      {/* Keyboard Instructions */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Keyboard className="w-4 h-4 text-primary" />
            <h3 className="font-fantasy text-sm font-medium">Keyboard Controls</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">W</Badge>
              <span>Move Up</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">A</Badge>
              <span>Move Left</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">S</Badge>
              <span>Move Down</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">D</Badge>
              <span>Move Right</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Space</Badge>
              <span>Action</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">I</Badge>
              <span>Inventory</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">Q</Badge>
              <span>Quests</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Controls */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-fantasy text-sm font-medium mb-3">Movement</h3>
          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('up')}
              className="aspect-square p-0"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('left')}
              className="aspect-square p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('right')}
              className="aspect-square p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('down')}
              className="aspect-square p-0"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <div></div>
          </div>
        </CardContent>
      </Card>

      {/* Action Controls */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-fantasy text-sm font-medium mb-3">Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={onAction}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Sword className="w-4 h-4" />
              Action
            </Button>
            
            <Button
              variant={showInventory ? "default" : "outline"}
              onClick={onToggleInventory}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Package className="w-4 h-4" />
              Inventory
            </Button>
            
            <Button
              variant={showQuests ? "default" : "outline"}
              onClick={onToggleQuests}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <ScrollText className="w-4 h-4" />
              Quests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControls;