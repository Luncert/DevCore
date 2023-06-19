interface Instance {
  instanceId: string;
}

interface Application {
  name: string;
  appId: string;
  deploymentId: string;
  applicationCreatedAt: string;
  artifactCreatedAt: string;
  loghubIntegrated: boolean;
  cfCockpitLink: string;
  instances: Instance[];
}

interface Service {
  name: string;
  dwcManaged: boolean;
  artifactResource: string;
  applications: Application[];
}

interface Space {
  name: string;
  services: Service[];
}

interface Organization {
  name: string;
  spaces: Space[];
}

interface LinkedData {
  value: string;
  language: string;
}

interface LogSourceSpace {
  spaceName: string;
  services: string[];
}

interface LogSourceOrg {
  orgName: string;
  spaces: LogSourceSpace[];
}

interface LogSourceInstance {
  instanceId: string;
  createdAt: number;
}

interface LogSourceApp {
  appId: string;
  deploymentId: string;
  createdAt: string;
  instances: LogSourceInstance[];
}

interface TerminalStyle {
  foreground?: string;
  background?: string;
  fontStyle?: string;
}

interface AliveConnection {
  logSourceId: string
  streamConnection: EventSource
}

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

interface Mark {
  pos: number;
  value: string;
  isQuote?: boolean;
}

interface Pos {
  start: number;
  end: number;
}
