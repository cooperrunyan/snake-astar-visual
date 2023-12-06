export type Cell = {
  f: number;
  g: number;
  h: number;
  x: number;
  y: number;
  parent?: Cell;
  wall: boolean;
};
