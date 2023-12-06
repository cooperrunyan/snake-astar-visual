import { randomApple } from './apple';
import { resetDirectionState } from './direction';
import { resetPauseState } from './pause';
import { resetSnakeState } from './snake';

export function resetState() {
  randomApple();
  resetDirectionState();
  resetSnakeState();
  resetPauseState();
}
