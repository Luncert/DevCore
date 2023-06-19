import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ISearchOptions, SearchAddon } from 'xterm-addon-search';
import * as XtermWebfont from 'xterm-webfont';
import WebLinksAddon, { LinkHandler } from './WebLinksAddon';
import 'xterm/css/xterm.css';

export default class Xterm {
  private term: Terminal;

  private fitAddon: FitAddon;

  private searchAddon: SearchAddon;

  constructor(linkHandler?: LinkHandler) {
    this.term = new Terminal({
      theme: {
        foreground: 'rgb(200, 200, 200)',
        background: 'rgb(17, 21, 29)',
      },
      allowTransparency: true,
      windowsMode: false,
      cursorStyle: 'underline',
      disableStdin: true,
      fontFamily: 'JetBrainsMono-Regular',
      convertEol: true, // support \n
      rendererType: 'canvas',
      scrollback: 100000,
      // fontSize: 24,
      // fontWeight: '400',
      // fontWeightBold: '500',
    });
    this.fitAddon = new FitAddon();
    this.searchAddon = new SearchAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(this.searchAddon);
    this.term.loadAddon(new WebLinksAddon(linkHandler));
    this.term.loadAddon(new XtermWebfont());

    this.term.onResize((arg: any) => {});
  }

  public onKey(
    listener: (arg: { key: string; domEvent: KeyboardEvent }) => void
  ) {
    this.term.onKey(listener);
  }

  public attach(elem: HTMLElement) {
    return (this.term as any).loadWebfontAndOpen(elem).then(() => {
      this.fitAddon.fit();
      window.onresize = () => this.fitAddon.fit();
      return null;
    });
  }

  public dettach() {
    window.onresize = null;
  }

  public write(data: string | Uint8Array) {
    this.term.write(data);
  }

  public writeln(data: string | Uint8Array) {
    this.term.writeln(data);
  }

  public findNext(text: string, searchOptions?: ISearchOptions) {
    this.searchAddon.findNext(text, searchOptions);
  }

  public findPrevious(text: string, searchOptions?: ISearchOptions) {
    this.searchAddon.findPrevious(text, searchOptions);
  }

  public clear() {
    this.term.clear();
  }
}
