import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ISearchOptions, SearchAddon } from 'xterm-addon-search';
import * as XtermWebfont from 'xterm-webfont';
import WebLinksAddon, { LinkHandler } from './WebLinksAddon';
import 'xterm/css/xterm.css';
import ApiContext from 'renderer/api/Api';

type KeyListener = (key: string, domEvent: KeyboardEvent) => void;

interface XtermOpt {
  createShell?: boolean;
  linkHandler?: LinkHandler;
}

export default class Xterm {
  private term: Terminal;

  private fitAddon: FitAddon;

  private searchAddon: SearchAddon;

  private shellId: string = '';

  private internalKeyListener: KeyListener | undefined;
  private keyListener: KeyListener | undefined;
  private dataListener: Callback | undefined;
  private closeListener: Callback | undefined;

  constructor(opt?: XtermOpt) {
    this.term = new Terminal({
      theme: {
        foreground: 'rgb(200, 200, 200)',
        background: 'rgb(17, 21, 29)',
      },
      allowTransparency: true,
      windowsMode: false,
      cursorStyle: 'underline',
      disableStdin: false,
      fontFamily: 'JetBrainsMono-Regular',
      convertEol: true, // support \n
      rendererType: 'canvas',
      scrollback: 100000,
      fontSize: 18,
      fontWeight: '400',
      fontWeightBold: '500',
    });
    this.fitAddon = new FitAddon();
    this.searchAddon = new SearchAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(this.searchAddon);
    this.term.loadAddon(new WebLinksAddon(opt?.linkHandler));
    this.term.loadAddon(new XtermWebfont());
    this.term.onKey(({key, domEvent}) => {
      this.internalKeyListener && this.internalKeyListener(key, domEvent);
      this.keyListener && this.keyListener(key, domEvent);
    });
    this.term.onData(() => {
      this.dataListener && this.dataListener();
    });

    if (opt?.createShell) {
      this.shellId = ApiContext.createShell(
        (s) => this.write(s),
        () => this.closeListener && this.closeListener()
      );

      this.term.onResize(({cols, rows}) => ApiContext.resizeShell(this.shellId, cols, rows));

      if (opt?.createShell) {
        this.internalKeyListener = (k, e) => {
          ApiContext.writeShell(this.shellId, k);
        };
      }
    }
  }

  public on(event: 'key', listener: KeyListener): void;
  public on(event: 'data', listener: Callback): void;
  public on(event: 'close', listener: Callback): void;
  public on(event: string, listener: any) {
    switch (event) {
      case 'key':
        this.keyListener = listener;
        break;
      case 'data':
        this.dataListener = listener;
        break;
      case 'close':
        this.closeListener = listener;
        break;
    }
  }

  public attach(elem: HTMLElement) {
    return (this.term as any).loadWebfontAndOpen(elem).then(() => {
      this.fitAddon.fit();
      elem.onresize = () => this.fitAddon.fit();
      window.onresize = () => this.fitAddon.fit();
      return null;
    });
  }

  public dettach() {
    window.onresize = null;
    ApiContext.destroyShell(this.shellId);
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
