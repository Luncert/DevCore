import os from 'os';
import { IPty } from 'node-pty';
import { v4 as uuidv4 } from 'uuid';
import NodePty from 'node-pty';

export class Shell {
  private ptyProc: IPty | null = null;

  constructor(opt?: ShellOpt) {
    let exec = opt?.executable ? opt.executable
      : (os.platform() === 'win32' ? 'powershell.exe' : 'bash');
    const ptyProc = NodePty.spawn(exec, opt?.args || [], {
      name: 'xterm',
      cols: opt?.cols || 100,
      rows: opt?.rows || 100,
      cwd: process.env.HOME,
      env: process.env
    })
    ptyProc.onData((s: string) => {
      // this.remote.emit(sid, data)
    })
    this.ptyProc = ptyProc;
  }

  resize(cols: number, rows: number) {
    this.ptyProc?.resize(cols, rows)
  }

  write(s: string) {
    this.ptyProc?.write(s)
  }

  onData(eventListener: (e: string) => void) {
    this.ptyProc?.onData(eventListener);
  }

  close() {
    this.ptyProc?.kill()
    this.ptyProc = null;
  }
}

class ShellManager {

  private sessions: Map<string, Shell> = new Map();

  create(opt?: ShellOpt) {
    const sid = uuidv4();
    const shell = new Shell(opt);
    this.sessions.set(sid, shell);
    return {sid, shell};
  }

  getShell(sid: string) {
    return this.sessions.get(sid);
  }

  destory(sid: string) {
    this.sessions.get(sid)?.close();
    this.sessions.delete(sid);
  }
}

const shellManager = new ShellManager();
export default shellManager;
