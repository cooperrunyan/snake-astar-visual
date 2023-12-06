const canvas = document.getElementById('game')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

type Cell = {
  f: number;
  g: number;
  h: number;
  x: number;
  y: number;
  parent?: Cell;
  wall: boolean;
};

type Segment = [string, number, number];
const snake: Segment[] = [
  ['1011', 1, 1],
  ['1010', 2, 1],
  ['1010', 3, 1],
  ['1010', 4, 1],
  ['1010', 5, 1],
  ['1110', 6, 1],
];

let direction = Direction.Right;

const unitSize = 25;
const widthUnitAmt = Math.round(window.innerWidth / unitSize);
const heightUnitAmt = Math.round(window.innerHeight / unitSize);
const heightUnit = Math.floor(window.innerHeight / heightUnitAmt);
const widthUnit = Math.floor(window.innerWidth / widthUnitAmt);

const width = widthUnit * widthUnitAmt;
const height = heightUnit * heightUnitAmt;
canvas.width = widthUnit * widthUnitAmt;
canvas.height = heightUnit * heightUnitAmt;

function randomApple() {
  const possibleLocations: [number, number][] = [];

  for (let x = 0; x < widthUnitAmt; x++) {
    for (let y = 0; y < heightUnitAmt; y++) {
      if (!snake.map(s => `${s[1]} ${s[2]}`).includes(`${x} ${y}`))
        possibleLocations.push([x, y]);
    }
  }

  return possibleLocations[
    Math.floor(Math.random() * possibleLocations.length)
  ];
}

let apple = randomApple();

function buildGrid(snake: Segment[]) {
  const grid: Cell[][] = [];

  const cols = widthUnitAmt;
  const rows = heightUnitAmt;

  for (let x = 0; x < cols; x++) {
    grid[x] = new Array(rows);
    for (let y = 0; y < rows; y++) {
      grid[x][y] = {
        x,
        y,
        f: 0,
        g: 0,
        h: 0,
        wall: false,
      };
    }
  }

  for (const segment of snake.slice(0, -1)) {
    if (grid.at(segment[1])?.at(segment[2]))
      grid.at(segment[1])!.at(segment[2])!.wall = true;
  }

  return grid;
}

function boardAvailable(snake: Segment[]) {
  const grid = buildGrid(snake);
  const head = snake.at(-1)!;

  // "x y"[]
  const accessibleNodeCoordinates: Set<string> = new Set();

  const addNeighbors = (node: Cell) => {
    const neighbors = [];

    if (
      node.x - 1 >= 0 &&
      !grid.at(node.x - 1)?.at(node.y)?.wall &&
      !accessibleNodeCoordinates.has(
        `${grid.at(node.x - 1)?.at(node.y)!.x} ${
          grid.at(node.x - 1)?.at(node.y)!.y
        }`,
      )
    )
      neighbors.push(grid.at(node.x - 1)?.at(node.y)!);
    if (
      node.x + 1 < widthUnitAmt &&
      !grid.at(node.x + 1)?.at(node.y)?.wall &&
      !accessibleNodeCoordinates.has(
        `${grid.at(node.x + 1)?.at(node.y)!.x} ${
          grid.at(node.x + 1)?.at(node.y)!.y
        }`,
      )
    )
      neighbors.push(grid.at(node.x + 1)?.at(node.y)!);
    if (
      node.y - 1 >= 0 &&
      !grid.at(node.x)?.at(node.y - 1)?.wall &&
      !accessibleNodeCoordinates.has(
        `${grid.at(node.x)?.at(node.y - 1)!.x} ${
          grid.at(node.x)?.at(node.y - 1)!.y
        }`,
      )
    )
      neighbors.push(grid.at(node.x)?.at(node.y - 1)!);
    if (
      node.y + 1 < heightUnitAmt &&
      !grid.at(node.x)?.at(node.y + 1)?.wall &&
      !accessibleNodeCoordinates.has(
        `${grid.at(node.x)?.at(node.y + 1)!.x} ${
          grid.at(node.x)?.at(node.y + 1)!.y
        }`,
      )
    )
      neighbors.push(grid.at(node.x)?.at(node.y + 1)!);

    for (const neighbor of neighbors) {
      if (accessibleNodeCoordinates.has(`${neighbor.x} ${neighbor.y}`))
        continue;
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

function relativeDirection(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
): Direction | null {
  if (x1 > x2) {
    if (x2 + 1 < widthUnitAmt) return Direction.Right;
  } else if (x1 < x2) {
    if (x2 - 1 >= 0) return Direction.Left;
  }

  if (y1 > y2) {
    if (y2 + 1 < heightUnitAmt) return Direction.Down;
  } else if (y1 < y2) {
    if (y2 - 1 >= 0) return Direction.Up;
  }

  return null;
}

function findNeighbors(node: Segment, grid: ReturnType<typeof buildGrid>) {
  // neighbors
  const neighbors: Cell[] = [];

  if (grid.at(node[1] - 1)?.at(node[2]) && node[1] - 1 >= 0)
    neighbors.push(grid.at(node[1] - 1)?.at(node[2])!);
  if (grid.at(node[1] + 1)?.at(node[2]) && node[1] + 1 < widthUnitAmt)
    neighbors.push(grid.at(node[1] + 1)?.at(node[2])!);
  if (grid.at(node[1])?.at(node[2] - 1) && node[2] - 1 >= 0)
    neighbors.push(grid.at(node[1])?.at(node[2] - 1)!);
  if (grid.at(node[1])?.at(node[2] + 1) && node[2] + 1 < heightUnitAmt)
    neighbors.push(grid.at(node[1])?.at(node[2] + 1)!);

  return neighbors;
}

function heuristic(neighbor: Cell): number {
  // euclidian
  return Math.sqrt(
    Math.pow(apple[1] - neighbor.y, 2) + Math.pow(apple[0] - neighbor.x, 2),
  );

  // manhattan
  // return Math.abs(apple.y - neighbor.y) + Math.abs(apple.x - neighbor.x);
}

function rect(x: number, y: number) {
  ctx.fillRect(x * widthUnit, y * heightUnit, widthUnit, heightUnit);
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hex(n: number) {
  return n.toString(16).padStart(2, '0');
}

const maxH = Math.sqrt(widthUnitAmt ** 2 + heightUnitAmt ** 2);
const maxG = widthUnitAmt * heightUnitAmt;

async function astr() {
  try {
    const grid = buildGrid(snake);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f0';
    let i = 0;

    for (const [_, x, y] of snake) {
      rect(x, y);
    }
    ctx.fillStyle = '#f00';
    rect(...apple);

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

        console.log(path);
        return path;
      }

      i++;

      if (current.parent) {
        if (i % 5 == 0) await wait(1);
        ctx.fillStyle = `#222`;
        rect(current.x, current.y);
      }

      const currentIndex = openSet.indexOf(current);
      if (currentIndex === -1) break;
      openSet.splice(currentIndex, 1);

      closedSet.push(current);

      // neighbors
      const neighbors = findNeighbors(['0000', current.x, current.y], grid);

      for (const neighbor of neighbors) {
        if (
          closedSet.includes(neighbor) ||
          neighbor.wall ||
          snake
            .map(s => s[1] + ' ' + s[2])
            .includes(neighbor.x + ' ' + neighbor.y)
        )
          continue;

        if (
          current.x === snake.at(-1)![1] &&
          current.y === snake.at(-1)![2] &&
          boardAvailable([
            ...snake.slice(1),
            ['0000', neighbor.x, neighbor.y] as any,
          ]).amt <= snake.length
        )
          continue;

        const tentativeG = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (tentativeG < neighbor.g) neighbor.g = tentativeG;
        } else {
          neighbor.g = tentativeG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor);
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

async function gameTick(next: Cell) {
  let increment = false;

  let newHead: Segment = ['', next.x, next.y];

  let fail = false;

  for (const segment of snake.slice(0, -1)) {
    if (newHead[1] === segment[1] && newHead[2] === segment[2]) {
      console.log(newHead, segment);
      fail = true;
      break;
    }

    if (
      newHead[1] < 0 ||
      newHead[1] >= widthUnitAmt! ||
      newHead[2] < 0 ||
      newHead[2] >= heightUnitAmt!
    ) {
      fail = true;
      break;
    }
  }
  snake.push(newHead!);

  ctx.fillStyle = '#0f0';
  rect(newHead[1], newHead[2]);
  if (newHead![1] === apple[0] && newHead![2] === apple[1]) {
    increment = true;
  }

  if (increment) randomApple();
  else {
    const tail = snake.shift()!;
    ctx.clearRect(
      tail[1] * widthUnit,
      tail[2] * heightUnit,
      widthUnit,
      heightUnit,
    );
  }

  if (fail) {
    console.log('fail');
    ctx.clearRect(0, 0, width, height);
  }
}

async function tick() {
  const path = (await astr())!;

  let i = 0;
  for (const p of path.slice(0, -1).reverse()) {
    ctx.fillStyle = `#777`;
    if (i % 2 === 0) {
      await wait(10);
    }
    rect(p.x, p.y);
    i++;
  }

  ctx.clearRect(0, 0, width, height);

  for (const p of path) {
    ctx.fillStyle = `#777`;
    rect(p.x, p.y);
  }

  ctx.fillStyle = '#0f0';

  for (const [_, x, y] of snake) {
    rect(x, y);
  }
  ctx.fillStyle = '#f00';
  rect(...apple);

  let next_seg = path.pop();
  while (next_seg) {
    await gameTick(next_seg);
    await wait(5);
    next_seg = path.pop();
  }
  apple = randomApple();
}

(async () => {
  const frame = async () => {
    await tick();

    requestAnimationFrame(frame);
  };
  frame();
})();
