import { Apple } from '../../types/Apple';

export function appleHTML(a: Apple) {
  return `<span style="grid-row: ${a[1] + 1} / ${a[1] + 2}; grid-column: ${a[0] + 1} / ${a[0] + 2};" class="Segment Apple"></span>`;
}
