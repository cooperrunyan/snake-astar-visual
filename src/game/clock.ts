import { config } from '../state/config';
import { wait } from './lib/wait';
import { render } from './render';

export async function clock(el: HTMLElement, fn: () => Promise<void> | void): Promise<void> {
  render(el);
  await Promise.all([fn(), wait(config.value.tickRate)]);

  return clock(el, fn);
}
