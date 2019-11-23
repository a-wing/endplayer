// Fork form https://github.com/Rocket1184/electron-netease-cloud-music/blob/master/src/main/settings.js


import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

const fsp = fs.promises;

export const productName = 'End Player';
const configDir = app.getPath('userData');
const configPath = path.join(configDir, 'settings.json');

export const defaultSettings = {
  engines: {
    danmuku_acplayer: {
      auto_match: true
    },
    subtatile_ass: {
      auto_match: true
    }
  },
  danmuku_acplayer: true,
  subtatile_ass: true,
  is_dev: true
};

/**
 * @typedef {typeof defaultSettings} Value
 * @param {Partial<Value>} value
 * @returns {Value}
 */
function trimSettings(value) {
    const res = defaultSettings;
    for (const [k, v] of Object.entries(defaultSettings)) {
        res[k] = Object.prototype.hasOwnProperty.call(value, k) ? value[k] : v;
    }
    return res;
}

function writeFile(target) {
    return fsp.writeFile(configPath, JSON.stringify(target, null, 4), 'utf8');
}

function readFile() {
    return fsp.readFile(configPath, 'utf8');
}

export async function set(target) {
    try {
        await fsp.access(configDir);
    } catch (e) {
        fsp.mkdir(configDir);
    }
    return writeFile(target);
}

export async function get() {
    let settings = defaultSettings;
    try {
        await fsp.access(configPath);
        const json = JSON.parse(await readFile());
        settings = trimSettings(json);
    } catch (e) {
        set(defaultSettings);
    }
    return settings;
}
