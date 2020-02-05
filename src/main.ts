import * as fs from "fs";
import * as path from "path";
import { ipcMain, BrowserWindow, app } from "electron";

import * as Setting from "./setting";
import { getPluginEntry } from "mpv.js";
//require("electron-debug")({showDevTools: false});

import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

const pluginDir = path.join(path.dirname(require.resolve("mpv.js")), "build", "Release");
if (process.platform !== "linux") { process.chdir(pluginDir); }

app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("register-pepper-plugins", getPluginEntry(pluginDir));

app.on("ready", () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 574,
    autoHideMenuBar: true,
    useContentSize: process.platform !== "linux",
    title: "End player",
    webPreferences: {plugins: true},
  });
  win.setMenu(null);
  win.loadURL(`file://${__dirname}/../../index.html`);

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
});

if (process.env.NODE_ENV === 'development') {
  app.on('ready', () => {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    });
  });
}

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("setting", async (event, arg) => {
  if (arg === "get") {
    Setting.get().then(res => {

      // if electron >= v5.0.0
      // event.reply('setting', 'pong')

      // current electron == 4.2.8  need mpv.js support
      event.sender.send('setting', res);
    })
  } else {
    // Save Setting
    await Setting.set(arg)

    Setting.get().then(res => {
      event.sender.send('setting', res);
    })
  }
})

