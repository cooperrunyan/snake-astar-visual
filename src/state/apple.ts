import { config } from './config';
import { snake } from './snake';

export const apple = {
  value: random(),
};

export const randomApple = () => (apple.value = random());

function random() {
  const possibleLocations: [number, number][] = [];

  for (let x = 0; x < config.value.widthUnitAmt; x++) {
    for (let y = 0; y < config.value.heightUnitAmt; y++) {
      if (!snake.value.map(s => `${s[1]} ${s[2]}`).includes(`${x} ${y}`)) possibleLocations.push([x, y]);
    }
  }

  return possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
}
