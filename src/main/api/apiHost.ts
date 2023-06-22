import { Channels } from "../../common/Constants";
import { BrowserWindow, ipcMain } from "electron";

export function registerApi(mainWindow: BrowserWindow) {
  ipcMain.on(Channels.Ping.toString(), async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply(Channels.Ping.toString(), msgTemplate('pong'));
  });
}
