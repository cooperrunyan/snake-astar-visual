import { Apple } from '../../types/Apple';
import { Cell } from '../../types/Cell';
import { Direction } from '../../types/Direction';
import { Segment } from '../../types/Segment';
import { boardAvailable } from '../lib/boardAvailable';
import { buildGrid } from '../lib/buildGrid';
import { findNeighbors } from '../lib/findNeighbors';

export function closest(snake: Segment[], apple: Apple, _direction: Direction) {
  try {
    const grid = buildGrid(snake);

    let path: Cell[] = [];

    const openSet: Cell[] = [
      {
        f: 0,
        g: 0,
        h: 0,
        x: snake.at(-1)![1],
        y: snake.at(-1)![2],
        wall: false,
      },
    ];

    const closedSet: Cell[] = [];

    while (openSet.length !== 0) {
      const current = openSet.slice().sort((a, b) => a.f - b.f)[0]!;
      if (current.x === apple[0] && current.y === apple[1]) {
        path = [];

        let temp = current;
        path.push(temp);

        while (temp.parent) {
          path.push(temp.parent);
          temp = temp.parent;
        }

        return path;
      }

      const currentIndex = openSet.indexOf(current);
      if (currentIndex === -1) break;
      openSet.splice(currentIndex, 1);

      closedSet.push(current);

      // neighbors
      const neighbors = findNeighbors(['0000', current.x, current.y], grid);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.wall || snake.map(s => s[1] + ' ' + s[2]).includes(neighbor.x + ' ' + neighbor.y)) continue;

        if (
          current.x === snake.at(-1)![1] &&
          current.y === snake.at(-1)![2] &&
          boardAvailable([...snake.slice(1), ['0000', neighbor.x, neighbor.y] as any]).amt <= snake.length
        )
          continue;

        const tentativeG = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (tentativeG < neighbor.g) neighbor.g = tentativeG;
        } else {
          neighbor.g = tentativeG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, apple);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function heuristic(neighbor: Cell, apple: Apple): number {
  // euclidian
  return Math.sqrt(Math.pow(apple[1] - neighbor.y, 2) + Math.pow(apple[0] - neighbor.x, 2));

  // manhattan
  // return Math.abs(apple.y - neighbor.y) + Math.abs(apple.x - neighbor.x);
}
