import { config } from '../../state/config';
import { Direction } from '../../types/Direction';
import { Segment } from '../../types/Segment';
import { boardAvailable } from '../lib/boardAvailable';
import { buildGrid } from '../lib/buildGrid';
import { findNeighbors } from '../lib/findNeighbors';

export function panic(snake: Segment[], direction: Direction) {
  const head = snake.at(-1)!;

  const possible = findNeighbors(snake.at(-1)!, buildGrid(snake))
    .map(n => ({
      node: n,
      available: boardAvailable([{ x: n.x, y: n.y } as any, ...snake.slice(1)]),
    }))
    .filter(cell => {
      if (direction === Direction.Up && cell.node.y - 1 === head[2]) return false;
      if (direction === Direction.Down && cell.node.y + 1 === head[2]) return false;
      if (direction === Direction.Left && cell.node.x - 1 === head[1]) return false;
      if (direction === Direction.Right && cell.node.x + 1 === head[1]) return false;
      if (cell.node.wall) return false;

      return true;
    })
    .sort((a, b) => a.available.percent - b.available.percent);

  const bestNode = possible[0]!.node;

  if (bestNode.x > head[1]) {
    if (head[1] + 1 < config.value.widthUnitAmt) return Direction.Right;
  } else if (bestNode.x < head[1]) {
    if (head[1] - 1 >= 0) return Direction.Left;
  }

  if (bestNode.y > head[2]) {
    if (head[2] + 1 < config.value.heightUnitAmt) return Direction.Down;
  } else if (bestNode.y < head[2]) {
    if (head[2] - 1 >= 0) return Direction.Up;
  }

  return null;
}
