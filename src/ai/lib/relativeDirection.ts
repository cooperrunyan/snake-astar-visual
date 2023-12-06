import { config } from '../../state/config';
import { Direction } from '../../types/Direction';

export function relativeDirection([x1, y1]: [number, number], [x2, y2]: [number, number]): Direction | null {
  if (x1 > x2) {
    if (x2 + 1 < config.value.widthUnitAmt) return Direction.Right;
  } else if (x1 < x2) {
    if (x2 - 1 >= 0) return Direction.Left;
  }

  if (y1 > y2) {
    if (y2 + 1 < config.value.heightUnitAmt) return Direction.Down;
  } else if (y1 < y2) {
    if (y2 - 1 >= 0) return Direction.Up;
  }

  return null;
}
