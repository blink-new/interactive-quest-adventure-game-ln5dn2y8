import { useEffect, useCallback } from 'react';

export interface KeyboardControls {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onAction?: () => void;
  onInventory?: () => void;
  onQuests?: () => void;
}

export const useKeyboard = (controls: KeyboardControls) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for game keys
    if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'i', 'I', 'q', 'Q'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key.toLowerCase()) {
      case 'w':
        controls.onMoveUp();
        break;
      case 's':
        controls.onMoveDown();
        break;
      case 'a':
        controls.onMoveLeft();
        break;
      case 'd':
        controls.onMoveRight();
        break;
      case ' ':
        controls.onAction?.();
        break;
      case 'i':
        controls.onInventory?.();
        break;
      case 'q':
        controls.onQuests?.();
        break;
    }
  }, [controls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};