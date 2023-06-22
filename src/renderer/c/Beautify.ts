import { CharStreams, CodePointCharStream, CommonToken, CommonTokenStream, RuleContext, Token } from 'antlr4ts';
import { Tree } from 'antlr4ts/tree/Tree';
import { JSONLexer } from 'grammar/JSONLexer';
import { JSONParser } from 'grammar/JSONParser';
import { ToStringLexer } from 'grammar/ToStringLexer';
import { ToStringParser } from 'grammar/ToStringParser';

export function beautify(s: string) {
  const ctx = new ToStringBeautifyContext();
  return ctx.beautify(s);
}

abstract class BeautifyContext {
  private _indent = 0
  private actions: Map<number, () => void> = new Map();
  private currentToken: Token | undefined;
  private buf: string[] = [];

  protected addAction(call: () => void, ...tokenTypes: number[]) {
    tokenTypes.forEach(t => this.actions.set(t, call))
    return this;
  }

  public beautify(source: string): string {
    const charStream = CharStreams.fromString(source);
    const tokens = this.parse(charStream);
    const b: string[] = [];
    // printTokens(tokens)
    for (const token of tokens) {
      if (token.type == -1) {
        continue;
      }
      this.currentToken = token;
      const call = this.actions.get(token.type);
      if (call) {
        call();
        b.push(...this.buf);
        this.buf = [];
      } else {
        b.push(token.text);
      }
    }
    return b.join('');
  }

  protected abstract parse(charStream: CodePointCharStream): Token[];

  protected newline() {
    this.buf.push('\n');
    return this;
  }

  protected space(n: number = 1) {
    if (n) {
      this.buf.push(' '.repeat(n));
    }
    return this;
  }

  protected indent(delta?: number) {
    if (delta) {
      this._indent += delta;
      if (this._indent < 0) {
        throw new Error("illegal parameter delta");
      }
    }
    this.buf.push('  '.repeat(this._indent));
    return this;
  }

  protected appendToken() {
    if (this.currentToken) {
      this.buf.push(this.currentToken.text);
    }
    return this;
  }
}

class JsonBeautifyContext extends BeautifyContext {

  constructor() {
    super();
    this.addAction(() => this.appendToken().newline().indent(1), 1, 5)
      .addAction(() => this.newline().indent(-1).appendToken(), 3, 6)
      .addAction(() => this.appendToken().newline().indent(), 2)
      .addAction(() => this.appendToken().space(), 4)
  }

  protected parse(charStream: CodePointCharStream): Token[] {
    const lexer = new JSONLexer(charStream);
    const tokenStream = new CommonTokenStream(lexer);
    new JSONParser(tokenStream).json();
    return tokenStream.getTokens();
  }
}

class ToStringBeautifyContext extends BeautifyContext {
  constructor() {
    super();
    this.addAction(() => this.appendToken().newline().indent(1), 1, 5, 7)
      .addAction(() => this.newline().indent(-1).appendToken(), 3, 6, 8)
      .addAction(() => this.appendToken().newline().indent(), 2)
      .addAction(() => this.space().appendToken().space(), 4)
  }

  protected parse(charStream: CodePointCharStream): Token[] {
    const lexer = new ToStringLexer(charStream);
    const tokenSream = new CommonTokenStream(lexer);
    const parser = new ToStringParser(tokenSream);
    parser.data();
    // printParseTree(parser.data(), parser.ruleNames);
    return tokenSream.getTokens();
  }
}

function printTokens(tokens: Token[]) {
  for (const t of tokens) {
    console.log(t.type, ':', t.text);
  }
}

function printParseTree(tree: Tree, ruleNames: string[]) {
  let indent = 0
  function process(t: Tree) {
    if (t.childCount === 0) {
      const token = t.payload as CommonToken;
      return `[${token.type}] '${token.text}'`
    }
    indent++;
    const rule = t.payload as RuleContext;
    let s = ruleNames[rule.ruleIndex] + `[${t.childCount}]` + ':\n' + ('  '.repeat(indent));
    for (let i = 0; i < t.childCount; i++) {
      s += process(t.getChild(i));
      if (i < t.childCount - 1) {
        s += '\n' + ('  '.repeat(indent));
      }
    }
    indent--;
    return s;
  }
  console.log(process(tree));
}
