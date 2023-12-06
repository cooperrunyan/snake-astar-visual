import { Direction } from '../types/Direction';

const INITIAL_DIRECTION = Direction.Right;

export const direction = { value: Direction.Right };

export const resetDirectionState = () => (direction.value = INITIAL_DIRECTION);
