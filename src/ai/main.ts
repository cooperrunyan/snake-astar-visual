import { closest } from './pathfinders/closest';
import { panic } from './pathfinders/panic';

import { Apple } from '../types/Apple';
import { Direction } from '../types/Direction';
import { Segment } from '../types/Segment';
import { boardAvailable } from './lib/boardAvailable';
import { relativeDirection } from './lib/relativeDirection';

export function getMove(snake: Segment[], apple: Apple, direction: Direction) {
  try {
    const head = snake.at(-1)!;

    if (boardAvailable(snake.slice()).percent <= 0.8) return panic(snake, direction);

    const route = closest(snake.slice(), apple, direction);
    if (!route) return panic(snake, direction);

    const nextHead = route.at(-2)!;

    return relativeDirection([nextHead.x, nextHead.y], [head[1], head[2]]);
  } catch {}

  return null;
}
