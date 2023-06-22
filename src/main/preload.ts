// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { Channels } from 'common/Constants';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel.toString(), ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel.toString(), subscription);

      return () => {
        ipcRenderer.removeListener(channel.toString(), subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel.toString(), (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
