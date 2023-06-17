import 'regenerator-runtime/runtime';
import { Registry, parseRawGrammar, INITIAL } from 'vscode-textmate';
import { loadWASM, OnigScanner, OnigString } from 'vscode-oniguruma';
import { styledString, getFontStyle } from '../xterm/Colors';
import wasmBin from './onig.wasm';
import logLang from './log.lang.xml';
import logColor from './log.color.json';

function loadColorSchema(colorDefs: ScopeStyleDef[]) {
  const schema: Map<string, TerminalStyle> = new Map();
  colorDefs.forEach((colorDef) => schema.set(colorDef.scope, colorDef.style));
  return schema;
}

// Create a registry that can create a grammar from a scope name.
// https://github.com/textmate/javascript.tmbundle/blob/master/Syntaxes/JavaScript.plist
function getRegistry() {
  const vscodeOnigurumaLib = loadWASM(wasmBin).then(() => {
    return {
      createOnigScanner(patterns: any) {
        return new OnigScanner(patterns);
      },
      createOnigString(s: any) {
        return new OnigString(s);
      },
    };
  });
  return new Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName: string) => {
      if (PLISTS[scopeName]) {
        const data = PLISTS[scopeName] as string;
        return parseRawGrammar(data);
      }
      console.log(`Unknown scope name: ${scopeName}`);
      return null;
    },
  });
}

const PLISTS = {
  'text.log': logLang,
};

const colorSchema: Map<string, TerminalStyle> = loadColorSchema(
  logColor.textMateRules
);

const registry = getRegistry();

interface ScopeStyleDef {
  scope: string;
  style: TerminalStyle;
}

function getStyle(scopeNames: string[]): TerminalStyle | null {
  // eslint-disable-next-line no-restricted-syntax
  for (const scope of scopeNames) {
    if (colorSchema.has(scope)) {
      return colorSchema.get(scope);
    }
  }
  return null;
}

export default async function highlight(
  source: string,
  output: (s: string) => void
) {
  const grammar = await registry.loadGrammar('text.log');
  const buf = [];

  let ruleStack = INITIAL;
  // eslint-disable-next-line no-restricted-syntax
  for (const line of source.split('\n')) {
    if (line.length > 0) {
      const lineTokens = grammar.tokenizeLine(line, ruleStack);

      let prevIndex = 0;
      for (let i = 0; i < lineTokens.tokens.length; i++) {
        const token = lineTokens.tokens[i];

        const style = getStyle(token.scopes);
        if (style != null) {
          buf.push(line.substring(prevIndex, token.startIndex))
          buf.push(
            styledString(
              line.substring(token.startIndex, token.endIndex),
              style.foreground,
              style.background,
              getFontStyle(style.fontStyle)
            )
          );
          prevIndex = token.endIndex;
        }
      }
      if (prevIndex < line.length) {
        buf.push(line.substring(prevIndex));
      }

      ruleStack = lineTokens.ruleStack;
    }

    buf.push('\n');
  }

  output(buf.slice(0, buf.length - 1).join(''));
}