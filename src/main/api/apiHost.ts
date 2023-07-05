import shellManager from "../c/ShellManager";
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
    const streamChannel = uuidv4();
    const {sid, shell} = shellManager.create({...opt,
      output: (s) => {
        mainWindow.webContents.send(streamChannel, s);
      }});
    event.returnValue = { sid, streamChannel };
  });


  ipcMain.on(Channels.Shell.Resize, (event, sid, cols, rows) => {
    shellManager.getShell(sid)?.resize(cols, rows);
  });

  ipcMain.on(Channels.Shell.Write, (event, sid, input) => {
    shellManager.getShell(sid)?.write(input);
  })

  ipcMain.on(Channels.Shell.Destory, (event, sid) => {
    shellManager.destory(sid);
  });
}
