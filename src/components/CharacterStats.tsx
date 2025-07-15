import React from 'react';
import { Character } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sword, Shield, Heart, Zap, Star, Coins } from 'lucide-react';

interface CharacterStatsProps {
  character: Character;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const healthPercentage = (character.health / character.maxHealth) * 100;
  const manaPercentage = (character.mana / character.maxMana) * 100;
  const xpPercentage = (character.experience / character.experienceToNext) * 100;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-fantasy text-primary flex items-center gap-2">
          <Star className="w-5 h-5" />
          {character.name}
          <Badge variant="secondary" className="ml-auto">
            Level {character.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Health</span>
            </div>
            <span>{character.health}/{character.maxHealth}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="health-bar" 
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Mana Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Mana</span>
            </div>
            <span>{character.mana}/{character.maxMana}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="mana-bar" 
              style={{ width: `${manaPercentage}%` }}
            />
          </div>
        </div>

        {/* Experience Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-green-500" />
              <span>Experience</span>
            </div>
            <span>{character.experience}/{character.experienceToNext}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="xp-bar" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Sword className="w-4 h-4 text-accent" />
            <span>Attack: {character.attack}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span>Defense: {character.defense}</span>
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
          <Coins className="w-4 h-4 text-accent" />
          <span>Gold: {character.gold}</span>
        </div>

        {/* Equipment */}
        {(character.equipment.weapon || character.equipment.armor) && (
          <div className="pt-2 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Equipment</h4>
            <div className="space-y-1 text-xs">
              {character.equipment.weapon && (
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3" />
                  <span>{character.equipment.weapon.name}</span>
                </div>
              )}
              {character.equipment.armor && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>{character.equipment.armor.name}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterStats;