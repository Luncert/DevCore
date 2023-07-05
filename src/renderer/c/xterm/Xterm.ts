import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ISearchOptions, SearchAddon } from 'xterm-addon-search';
import * as XtermWebfont from 'xterm-webfont';
import WebLinksAddon, { LinkHandler } from './WebLinksAddon';
import 'xterm/css/xterm.css';
import ApiContext from 'renderer/api/Api';

type KeyListener = (key: string, domEvent: KeyboardEvent) => boolean;

interface XtermOpt {
  createShell?: boolean;
  linkHandler?: LinkHandler;
}

export default class Xterm {
  private term: Terminal;

  private fitAddon: FitAddon;

  private searchAddon: SearchAddon;

  private shellId: string = '';

  private keyListeners: KeyListener[] = [];

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
      for (const listener of this.keyListeners) {
        if (!listener(key, domEvent)) {
          break;
        }
      }
    })

    if (opt?.createShell) {
      this.shellId = ApiContext.createShell((s) => {
        this.write(s);
      });

      this.term.onResize(({cols, rows}) => ApiContext.resizeShell(this.shellId, cols, rows));

      if (opt?.createShell) {
        this.keyListeners.push((k, e) => {
          ApiContext.writeShell(this.shellId, k);
          return true;
        })
      }
    }
  }

  public onKey(listener: (key: string, domEvent: KeyboardEvent) => boolean) {
    this.keyListeners.push(listener);
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
