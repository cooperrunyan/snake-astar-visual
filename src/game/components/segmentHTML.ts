import { Segment } from '../../types/Segment';

const borderStyle = '1px solid var(--bg)';

export function segmentHTML(s: Segment, isHead?: boolean) {
  return `
    <span ${isHead ? 'id="HEAD"' : ''} style="
      grid-row: ${s[2] + 1} / ${s[2] + 2};
      grid-column: ${s[1] + 1} / ${s[1] + 2};
      border-top: ${s[0][0] === '1' ? borderStyle : undefined};
      border-right: ${s[0][1] === '1' ? borderStyle : undefined};
      border-bottom: ${s[0][2] === '1' ? borderStyle : undefined};
      border-left: ${s[0][3] === '1' ? borderStyle : undefined};
    " class="Segment"></span>`;
}
