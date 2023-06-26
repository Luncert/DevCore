import process from 'process';
import child_process from 'child_process';
import iconv from 'iconv-lite';
import chalk from 'chalk';

const SHELL_MARKER = '_SHELL#MARKER_'
const ECHO_COMMAND = `echo ${SHELL_MARKER}${ process.platform === 'win32' ? '${pwd}\r' : '$PWD'}\n`

export default class Shell {

  private cwd: string
  private lastSucceed: boolean = true
  private writeOutput: DataHandler
  private proc: child_process.ChildProcessWithoutNullStreams

  constructor(opt: ShellOpt) {
    if (!opt.output) {
      throw new Error('output cannot be null.');
    }
    this.writeOutput = opt.output

    this.cwd = process.cwd().replace(/\\/g, '/')
    this.proc = child_process.spawn('bash', {
      shell: true
    })
    this.proc.stderr.on('data', (data) => this.writeOutput(data));
    this.proc.stdout.on('data', this.processOutput.bind(this));
    this.proc.on('close', () => opt.onClose && opt.onClose());

    process.on('SIGINT', () => this.close());

    this.writeOutput(Buffer.from(this.getPrompt()));
  }

  private getPrompt(): number[] {
    let str = chalk.cyan(this.cwd) + (this.lastSucceed ? chalk.greenBright('>') : chalk.red('>'))
    return str.split('').map((c) => c.charCodeAt(0))
  }

  // get cwd
  private processOutput(raw: Buffer) {
    let data = new Array < number > (...raw)
    let markStart = -1
    for (let i = 0; i < data.length; i++) {
      const c = data[i]
      if (markStart == -1) {
        if (c === SHELL_MARKER.charCodeAt(0)) {
          markStart = i
        }
      } else {
        const cursor = i - markStart
        if (c !== SHELL_MARKER.charCodeAt(cursor)) {
          if (cursor === SHELL_MARKER.length) {
            // find cwd
            for (let j = i; j < data.length; j++) {
              // console.log(data[j])
              if (data[j] == 10) { // '\n'
                this.cwd = String.fromCharCode(...data.slice(i, j)).replace(/\\/g, '/') // j - 1 = '\r'
                let prompt = this.getPrompt()
                i += prompt.length
                data.splice(markStart, j + 2 - markStart, ...prompt) // 2 = '\r\n', which has already been included by promt
                console.log('<', data.length, 0, j - markStart, String.fromCharCode(...data))
              }
            }
          }
          markStart = -1
        }
      }
    }
    this.writeOutput(iconv.decode(Buffer.from(data), 'gbk'))
  }

  /**
   * submit input to Terd to process
   * @param command string
   */
  public process(command: Buffer | string) {
    this.proc.stdin.write(command);
    this.proc.stdin.write(ECHO_COMMAND);
  }

  public close() {
    this.proc.kill();
  }
}
