import Channels from "common/Constants";

const ipc = window.electron.ipcRenderer;

const cleaners: Map<string, () => void> = new Map();

const ApiContext = {
  createShell(onData: (s: string) => void, opt?: ShellOpt): string {
    const { sid, streamChannel } = ipc.sendMessageSync(Channels.Shell.Create, [opt]);
    const cleaner = ipc.on(streamChannel as string, (s) => onData(s as string))
    cleaners.set(sid, cleaner);
    return sid;
  },
  resizeShell(sid: string, cols: number, rows: number) {
    console.log('resize', cols, rows)
    ipc.sendMessage(Channels.Shell.Resize, sid, cols, rows);
  },
  writeShell(sid: string, s: string) {
    ipc.sendMessage(Channels.Shell.Write, sid, s);
  },
  destroyShell(sid: string) {
    const cleaner = cleaners.get(sid);
    if (cleaner) {
      cleaner();
    }
    cleaners.delete(sid);
    ipc.sendMessage(Channels.Shell.Destory)
  }
};

export default ApiContext;
