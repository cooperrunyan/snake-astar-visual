import { apple } from '../state/apple';
import { snake } from '../state/snake';
import { appleHTML } from './components/appleHTML';
import { segmentHTML } from './components/segmentHTML';

export function render(el: HTMLElement) {
  el.innerHTML = `
      ${snake.value.map((segment, i, arr) => segmentHTML(segment, arr.length - 1 === i)).join(' ')}
      ${appleHTML(apple.value)}
  `;
}
