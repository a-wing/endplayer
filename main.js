// Create at: 2019.06.04
// Remember that my internet is broken this day.


"use strict";

const path = require("path");
const { BrowserWindow, app } = require("electron");
const { getPluginEntry } = require("mpv.js");
//require("electron-debug")({showDevTools: false});

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
  win.loadURL(`file://${__dirname}/index.html`);
  //win.webContents.openDevTools()
});

app.on("window-all-closed", () => {
  app.quit();
});
