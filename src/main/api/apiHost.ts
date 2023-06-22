import shellManager from "main/c/Shell";
import Channels from "../../common/Constants";
import { v4 as uuidv4 } from 'uuid';
import { BrowserWindow, ipcMain } from "electron";

export function registerApi(mainWindow: BrowserWindow) {
  ipcMain.on(Channels.Ping, async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply(Channels.Ping, msgTemplate('pong'));
  });

  ipcMain.on(Channels.Shell.Create, (event, opt) => {
    const {sid, shell} = shellManager.create(opt);
    const streamChannel = uuidv4();
    shell.onData((s) => {
      ipcMain.emit(streamChannel, s);
    });
    event.returnValue = { sid, streamChannel };
  });

  ipcMain.on(Channels.Shell.Resize, (event, sid, cols, rows) => {
    shellManager.getShell(sid)?.resize(cols, rows);
  });

  ipcMain.on(Channels.Shell.Write, (event, sid, data) => {
    shellManager.getShell(sid)?.write(data);
  })

  ipcMain.on(Channels.Shell.Destory, (event, sid) => {
    shellManager.destory(sid);
  });
}
