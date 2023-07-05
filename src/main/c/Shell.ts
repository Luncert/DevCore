import process from 'process';
import os from 'os';
const pty = require('node-pty') as any;

export default class Shell {

  private writeOutput: DataHandler
  private proc: any;

  constructor(opt: ShellOpt) {
    if (!opt.output) {
      throw new Error('output cannot be null.');
    }
    this.writeOutput = opt.output

    const shell = process.env[process.platform === 'win32' ? 'COMSPEC' : 'SHELL'];
    this.proc = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: opt.cols || 80,
      rows: opt.rows || 30,
      cwd: os.homedir(),
      env: process.env
    });

    this.proc.on('data', (data: any) => this.writeOutput(data));
    this.proc.on('close', () => opt.onClose && opt.onClose());

    process.on('SIGINT', () => this.close());
  }

  public resize(cols: number, rows: number) {
    this.proc.resize(cols, rows);
  }

  /**
   * submit input to Terd to process
   * @param command string
   */
  public write(command: Buffer | string) {
    this.proc.write(command);
  }

  public close() {
    this.proc.kill();
  }
}
