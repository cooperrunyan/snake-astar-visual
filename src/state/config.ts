import { DEFAULT_UNIT_SIZE } from '../game/constants/DEFAULT_UNIT_SIZE';
import { TICK_RATE } from '../game/constants/TICK_RATE';

export interface Config {
  bg?: string;
  fg?: string;
  primary?: string;
  secondary?: string;

  unitSize: number;

  width: number;
  widthUnit: number;
  widthUnitAmt: number;

  height: number;
  heightUnit: number;
  heightUnitAmt: number;

  border: boolean;

  tickRate: number;

  noQueue: boolean;
}

export function setConfig() {
  const params = new Map<string, string>();
  new URL(location.href).searchParams.forEach((v, k) => params.set(k, v));
  const config: Partial<Config> = Object.fromEntries([...params.entries()].map(([k, v]) => [k, toPrimitive(v)]));

  config.unitSize = config.unitSize || DEFAULT_UNIT_SIZE;

  config.width = document.documentElement.clientWidth;
  config.widthUnitAmt = Math.round(config.width / config.unitSize!);
  config.widthUnit = config.width / config.widthUnitAmt;

  config.height = document.documentElement.clientHeight;
  config.heightUnitAmt = Math.round(config.height / config.unitSize!);
  config.heightUnit = config.height / config.heightUnitAmt;

  config.border = config.border || false;
  config.noQueue = config.noQueue ?? false;
  config.tickRate = +(config.tickRate ?? TICK_RATE);

  if (!config.border) document.documentElement.style.setProperty('--shadow', 'none');

  for (const [key, value] of Object.entries(config)) {
    document.documentElement.style.setProperty(`--${key}`, String(value));

    if (['widthUnit', 'heightUnit'].includes(key)) document.documentElement.style.setProperty(`--${key}`, `${value}px`);
  }

  return config as Config;
}

export const config = { value: setConfig() };

export const updateConfig = () => (config.value = setConfig());

function toPrimitive(x: string): boolean | null | undefined | number | string {
  if (!Number.isNaN(+x)) return +x;

  if (x === 'null') return null;
  if (x === 'true') return true;
  if (x === 'false') return false;
  if (x === 'undefined') return undefined;

  return x;
}
