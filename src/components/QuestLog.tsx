import React from 'react';
import { Quest } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollText, Crown, CheckCircle, Circle } from 'lucide-react';

interface QuestLogProps {
  quests: Quest[];
}

const QuestLog: React.FC<QuestLogProps> = ({ quests }) => {
  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="font-fantasy text-primary flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          Quest Log
          <Badge variant="secondary" className="ml-auto">
            {activeQuests.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {/* Active Quests */}
          {activeQuests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Circle className="w-3 h-3" />
                Active Quests
              </h3>
              <div className="space-y-3">
                {activeQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-3 rounded-lg bg-secondary/20 border border-border/50"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {quest.isMainQuest && (
                        <Crown className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">
                          {quest.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {quest.description}
                        </p>
                      </div>
                      <Badge 
                        variant={quest.isMainQuest ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {quest.isMainQuest ? "Main" : "Side"}
                      </Badge>
                    </div>

                    {/* Objectives */}
                    <div className="space-y-2">
                      {quest.objectives.map((objective) => (
                        <div key={objective.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={objective.completed ? 'text-green-400' : 'text-muted-foreground'}>
                              {objective.description}
                            </span>
                            <span className="text-muted-foreground">
                              {objective.current}/{objective.required}
                            </span>
                          </div>
                          <Progress 
                            value={(objective.current / objective.required) * 100}
                            className="h-1"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Rewards */}
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Rewards:</span>
                        <span className="text-green-400">{quest.rewards.experience} XP</span>
                        <span className="text-accent">{quest.rewards.gold} Gold</span>
                        {quest.rewards.items.length > 0 && (
                          <span className="text-blue-400">
                            +{quest.rewards.items.length} items
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Completed Quests
              </h3>
              <div className="space-y-2">
                {completedQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <div className="flex items-center gap-2">
                      {quest.isMainQuest && (
                        <Crown className="w-3 h-3 text-accent" />
                      )}
                      <span className="text-sm text-green-400">
                        {quest.title}
                      </span>
                      <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeQuests.length === 0 && completedQuests.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No quests available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestLog;