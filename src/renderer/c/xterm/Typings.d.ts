interface InputStream {
}

interface OutputStream {
  write(s: string | Uint8Array): void;
  writeln(s: string | Uint8Array): void;
}

interface Command {
  getName(): string;
  run(
    args: string[],
    input: InputStream,
    output: OutputStream
  ): Promise<number>;
}

interface Interactor {
  init(input: InputStream, output: OutputStream): void;
  execute(command: string): void;
}
