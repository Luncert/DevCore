import process from 'process';
import os from 'os';
import { spawn, IPty } from 'node-pty';
import Terd from './Terd/src/Terd';

export class Shell {

  private writeOutput: DataHandler;
  private proc: IPty;

  constructor(opt: ShellOpt) {
    if (!opt.output) {
      throw new Error('output cannot be null.');
    }
    this.writeOutput = opt.output;

    const shell = process.env[process.platform === 'win32' ? 'COMSPEC' : 'SHELL'];
    this.proc = spawn(shell || '/bin/bash', [], {
      name: 'xterm-color',
      cols: opt.cols || 80,
      rows: opt.rows || 30,
      cwd: os.homedir(),
      env: process.env
    });

    this.proc.onData((data: any) => this.writeOutput(data));
    if (opt.onClose) {
      this.proc.onExit(() => opt.onClose && opt.onClose());
    }

    process.on('SIGINT', () => this.close());
  }

  public resize(cols: number, rows: number) {
    this.proc.resize(cols, rows);
  }

  /**
   * submit input to Terd to process
   * @param command string
   */
  public write(command: string) {
    this.proc.write(command);
  }

  public close() {
    this.proc.kill();
  }
}

export default class TerdShell extends Terd {

  constructor(opt: ShellOpt) {
    super({ printBanner: true, printPrompt: true, disableExit: true });
    this.on('data', data => opt.output && opt.output(data));
    this.prompt();
  }

  write(input: string) {
    this.processKey(Buffer.from(input));
  }
}
