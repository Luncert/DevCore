import Channels from "common/Constants";

const ipc = window.electron.ipcRenderer;

const cleanerMap: Map<string, Callback[]> = new Map();

const ApiContext = {
  createShell(
    onData: (s: string) => void,
    onClose?: Callback,
    onProcessExit?: Consumer<ExitEvent>): string {
    const { sid, streamChannel } = ipc.sendMessageSync(Channels.Shell.Create);
    cleanerMap.set(sid, [
      ipc.on(Channels.Shell.OnProcessExit, (e) => onProcessExit && onProcessExit(e as any)),
      ipc.on(Channels.Shell.OnClose, () => onClose && onClose()),
      ipc.on(streamChannel as string, (s) => onData(s as string))
    ]);
    return sid;
  },
  resizeShell(sid: string, cols: number, rows: number) {
    ipc.sendMessage(Channels.Shell.Resize, sid, cols, rows);
  },
  writeShell(sid: string, command: string) {
    ipc.sendMessage(Channels.Shell.Write, sid, command);
  },
  destroyShell(sid: string) {
    const cleaners = cleanerMap.get(sid);
    if (cleaners) {
      for (const cleaner of cleaners) {
        cleaner();
      }
    }
    cleanerMap.delete(sid);
    ipc.sendMessage(Channels.Shell.Destory)
  }
};

export default ApiContext;
