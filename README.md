Endplayer
=====

> Electron Native Danmaku Player

![Endplayer](https://raw.githubusercontent.com/a-wing/endplayer/gh-pages/screenshot/endplayer.png)

> Use Electron, React, mpv, danmaku player

## Todo
- [ ] Engine && Loder System
  - [x] Engine: Danmaku
    - [x] Loader: Auto Search ACplayer(dandanplayer API) danmaku
    - [x] Loader: handle Bilibili danmaku
    - [ ] Plugin: Send Danmaku
    - [ ] Danmaku Filter
  - [x] Engine: Subtitle
    - [x] Loader: handleSubtitleLoad Subtitle ass
    - [ ] Loader: Auto Search SubtitleLoad
- [ ] Play List
- [ ] Socket control API (Maybe http RESTful Or RPC)
- [ ] Shortcut key support
- [x] Debug display log
- [x] ~~UI blur support~~ Refactor UI

## Depends
- mpv

## Build
```
npm install

# For Linux
npm run use-system-ffmpeg

# Run
npm run build
npm run start
```

## About Get bilibili Danmaku

```
https://comment.bilibili.com/ + (cid) + (.xml)
https://comment.bilibili.com/52175602.xml

Or

https://api.bilibili.com/x/v1/dm/list.so?oid= + (cid)
https://api.bilibili.com/x/v1/dm/list.so?oid=87404714
```

## Acknowledgement
- [Kagami/mpv.js](https://github.com/Kagami/mpv.js)
- [weizhenye/Danmaku](https://github.com/weizhenye/Danmaku)
- [weizhenye/ASS](https://github.com/weizhenye/ASS)

