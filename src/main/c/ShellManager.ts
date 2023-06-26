import { v4 as uuidv4 } from 'uuid';
import Shell from './Shell';

class ShellManager {

  private sessions: Map<string, Shell> = new Map();

  create(opt: ShellOpt) {
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
