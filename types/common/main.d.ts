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
