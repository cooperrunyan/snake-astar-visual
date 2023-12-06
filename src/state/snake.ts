import { Segment } from '../types/Segment';

const INITIAL_SNAKE: Segment[] = [
  ['1011', 1, 1],
  ['1010', 2, 1],
  ['1010', 3, 1],
  ['1010', 4, 1],
  ['1010', 5, 1],
  ['1110', 6, 1],
];

export const snake: { value: Segment[] } = { value: JSON.parse(JSON.stringify(INITIAL_SNAKE)) };

export const resetSnakeState = () => (snake.value = JSON.parse(JSON.stringify(INITIAL_SNAKE)));
