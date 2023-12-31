import { v4 as uuidv4 } from 'uuid';
import highlight from '../highlight/highlight';
import { styledString } from '../xterm/Colors';
import { beautify } from './Beautify';

const linkedData: Map<string, LinkedData> = new Map();

function replaceDataWithLink(source: string) {
  const stack: Mark[] = [];
  const pairs: Pos[] = [];

  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === '{' || c === '[') {
      stack.push({ pos: i, value: c });
    } else if (c === "'" || c === '"') {
      if (stack.length > 0) {
        const m = stack[stack.length - 1];
        if (!m.isQuote) {
          stack.push({ pos: i, value: c, isQuote: true });
        } else if (m.value === c) {
          stack.splice(-1);
        }
      }
    } else if (c === '}' || c === ']') {
      if (stack.length > 0) {
        const m = stack[stack.length - 1];
        if (m.value.charCodeAt(0) + 2 === c.charCodeAt(0)) {
          const mi = stack.splice(-1)[0];
          if (stack.length === 0) {
            pairs.push({ start: mi.pos, end: i + 1 });
          }
        }
      }
    }
  }

  const buf = [];
  let i = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const p of pairs) {
    let data = source.substring(p.start, p.end);

    try {
      const size = p.end - p.start;
      if (size < 100) {
        continue;
      }
      if (i < p.start) {
        buf.push(source.substring(i, p.start));
      }
      if (size < 500) {
        buf.push(beautify(data));
      } else {
        const dataId = uuidv4();
        linkedData.set(dataId, {
          language: 'json',
          value: data,
        });
        buf.push(`[ loghub://data/${dataId} ]`);
      }
      i = p.end;
    } catch (e) {
      // ignored
    }
  }
  if (i < source.length) {
    buf.push(source.substring(i));
  }

  return buf.join('');
}

export function getLinkedData(dataId: string) {
  return linkedData.get(dataId);
}

export function clearDataBuffer() {
  linkedData.clear();
}

interface LogTypeConfig {
  name: string;
  style: TerminalStyle;
}

const LOG_TYPE_CONFIG: LogTypeConfig[] = [
  {
    name: 'APP',
    style: { background: 'rgb(77, 70, 167)' },
  },
  {
    name: 'RTR',
    style: { background: 'rgb(109, 167, 70)' },
  },
  {
    name: 'STG',
    style: { background: 'rgb(109, 167, 70)' },
  },
  {
    name: 'API',
    style: { background: 'rgb(109, 167, 70)' },
  },
  {
    name: 'UKN',
    style: { background: 'rgb(109, 167, 70)' },
  },
];

export default async function processLog(
  data: string,
  output: (s: string) => void,
  printLogType?: boolean
) {
  // eslint-disable-next-line no-restricted-syntax
  for (const raw of data.split('\n')) {
    if (!raw) {
      continue;
    }

    const log = JSON.parse(raw);
    const config = LOG_TYPE_CONFIG[log.type];
    if (printLogType) {
      output(
        styledString(
          `[${config.name}]`,
          config.style.foreground,
          config.style.background
        )
      );
    } else {
      output(styledString(' ', undefined, config.style.background));
    }
    output(' ');

    let { payload } = log;
    if (payload.length > 0) {
      payload = replaceDataWithLink(payload);
      await highlight(payload, output);
    }
  }
}
