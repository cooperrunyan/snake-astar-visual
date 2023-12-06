import { getMove } from '../ai/main';
import { apple, randomApple } from '../state/apple';
import { config, updateConfig } from '../state/config';
import { direction } from '../state/direction';
import { resetState } from '../state/resetState';
import { snake } from '../state/snake';
import { Direction } from '../types/Direction';
import { Segment } from '../types/Segment';
import { clock } from './clock';

const game = document.querySelector('#game') as HTMLDivElement;

window.addEventListener('resize', () => updateConfig());

clock(game, async () => {
  let increment = false;
  const head = snake.value.at(-1)!;

  let newHead: Segment = ['1111', head[1], head[2]];

  if (direction.value === Direction.Up) {
    newHead[0] = '1101';
    head[0] = '0' + head[0][1] + head[0][2] + head[0][3];
    newHead[2]--;
  } else if (direction.value === Direction.Down) {
    newHead[0] = '0111';
    head[0] = head[0][0] + head[0][1] + '0' + head[0][3];
    newHead[2]++;
  } else if (direction.value === Direction.Left) {
    newHead[0] = '1011';
    head[0] = head[0][0] + head[0][1] + head[0][2] + '0';
    newHead[1]--;
  } else if (direction.value === Direction.Right) {
    newHead[0] = '1110';
    head[0] = head[0][0] + '0' + head[0][2] + head[0][3];
    newHead[1]++;
  }

  let fail = false;

  snake.value.push(newHead!);

  for (const segment of snake.value.slice(0, -1)) {
    if (newHead[1] === segment[1] && newHead[2] === segment[2]) {
      fail = true;
      break;
    }

    if (newHead[1] < 0 || newHead[1] >= config.value.widthUnitAmt! || newHead[2] < 0 || newHead[2] >= config.value.heightUnitAmt!) {
      fail = true;
      break;
    }
  }

  if (newHead![1] === apple.value[0] && newHead![2] === apple.value[1]) increment = true;

  if (increment) randomApple();
  else snake.value.shift();

  const secondLastTail = snake.value.at(1)!;
  const tail = snake.value.at(0)!;

  tail[0] = '1111';

  const tailXDiff = +secondLastTail[1] - +tail[1];
  const tailYDiff = +secondLastTail[2] - +tail[2];

  if (tailXDiff > 0) tail[0] = '1011';
  else if (tailXDiff < 0) tail[0] = '1110';
  else if (tailYDiff > 0) tail[0] = '1101';
  else if (tailYDiff < 0) tail[0] = '0111';

  const nextMove = getMove(snake.value, apple.value, direction.value);

  console.log(nextMove);

  if (nextMove) direction.value = nextMove;

  if (fail) return void resetState();
  return;
});
