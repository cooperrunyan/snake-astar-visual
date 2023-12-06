import { config } from '../../state/config';
import { Cell } from '../../types/Cell';
import { Segment } from '../../types/Segment';
import { buildGrid } from './buildGrid';

export function boardAvailable(snake: Segment[]) {
  const grid = buildGrid(snake);
  const head = snake.at(-1)!;

  // "x y"[]
  const accessibleNodeCoordinates: Set<string> = new Set();

  const addNeighbors = (node: Cell) => {
    const neighbors = [];

    if (
      node.x - 1 >= 0 &&
      !grid.at(node.x - 1)?.at(node.y)?.wall &&
      !accessibleNodeCoordinates.has(`${grid.at(node.x - 1)?.at(node.y)!.x} ${grid.at(node.x - 1)?.at(node.y)!.y}`)
    )
      neighbors.push(grid.at(node.x - 1)?.at(node.y)!);
    if (
      node.x + 1 < config.value.widthUnitAmt &&
      !grid.at(node.x + 1)?.at(node.y)?.wall &&
      !accessibleNodeCoordinates.has(`${grid.at(node.x + 1)?.at(node.y)!.x} ${grid.at(node.x + 1)?.at(node.y)!.y}`)
    )
      neighbors.push(grid.at(node.x + 1)?.at(node.y)!);
    if (
      node.y - 1 >= 0 &&
      !grid.at(node.x)?.at(node.y - 1)?.wall &&
      !accessibleNodeCoordinates.has(`${grid.at(node.x)?.at(node.y - 1)!.x} ${grid.at(node.x)?.at(node.y - 1)!.y}`)
    )
      neighbors.push(grid.at(node.x)?.at(node.y - 1)!);
    if (
      node.y + 1 < config.value.heightUnitAmt &&
      !grid.at(node.x)?.at(node.y + 1)?.wall &&
      !accessibleNodeCoordinates.has(`${grid.at(node.x)?.at(node.y + 1)!.x} ${grid.at(node.x)?.at(node.y + 1)!.y}`)
    )
      neighbors.push(grid.at(node.x)?.at(node.y + 1)!);

    for (const neighbor of neighbors) {
      if (accessibleNodeCoordinates.has(`${neighbor.x} ${neighbor.y}`)) continue;
      accessibleNodeCoordinates.add(`${neighbor.x} ${neighbor.y}`);
      addNeighbors(neighbor);
    }
  };

  addNeighbors(grid.at(head[1])!.at(head[2])!);

  const amt = grid.flatMap(row => row.filter(node => !node.wall)).length;

  return {
    amt,
    percent: accessibleNodeCoordinates.size / amt,
  };
}
