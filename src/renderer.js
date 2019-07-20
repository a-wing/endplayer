"use strict";

const path = require("path");
const React = require("react");
const ReactDOM = require("react-dom");
const { remote } = require("electron");
const { ReactMPV } = require("mpv.js");

import { Vvideo, DanmakuDOM, Ass } from "./tsc/engines/engine";

const BilibiliParser = require('./plugins/bilibili')
const fs = require('fs');

console.log(BilibiliParser)

class Main extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mpv = null;
    this.state = {pause: true, "time-pos": 0, duration: 0, fullscreen: false};
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMPVReady = this.handleMPVReady.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
    this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
    this.handleLoad = this.handleLoad.bind(this);


    this.engines = [];
    this.timer = null;
    // danmaku
    this.danmaku = null;
    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleDanmakuLoad = this.handleDanmakuLoad.bind(this);
    this.handleSubtitleLoad = this.handleSubtitleLoad.bind(this);
    this.loadLocalFile = this.loadLocalFile.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
    this.state = { cursor: 'none' };
    this.timer = null;
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    window.addEventListener('resize', this.onWindowResize)

  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    window.removeEventListener('resize', this.onWindowResize)
  }
  onWindowResize() {
    this.engines.map(engine => engine.resize())
  }
  loadLocalFile(filepath) {
    const fs = require('fs')
    return (new DOMParser()).parseFromString(fs.readFileSync(filepath).toString(), "text/xml");
    //fs.readFile(filepath, (err, file) => {
    //  if (err) {
    //    return alert(err)
    //  }
    //  console.log(file)
    //  return file
    //})
  }
  handleMouse() {
    this.setState({ cursor: '' })

    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.setState({ cursor: 'none' }); }, 3000)
  }
  bilibiliDanmakuLoad(file) {
    this.danmakuLoad(BilibiliParser(this.loadLocalFile(file)));
  }
  handleKeyDown(e) {
    e.preventDefault();
    if (e.key === "f" || (e.key === "Escape" && this.state.fullscreen)) {
      this.toggleFullscreen();
    } else if (this.state.duration) {
      this.mpv.keypress(e);
    }
  }
  handleMPVReady(mpv) {
    this.mpv = mpv;
    const observe = mpv.observe.bind(mpv);
    ["pause", "time-pos", "duration", "eof-reached"].forEach(observe);
    this.mpv.property("hwdec", "auto");
    this.mpv.command("loadfile", path.join(__dirname, "src/test.mkv"));
  }
  handlePropertyChange(name, value) {
    if (name === "time-pos" && this.seeking) {
      return;
    } else if (name === "eof-reached" && value) {
      this.mpv.property("time-pos", 0);
    } else {
      this.setState({[name]: value});
    }
  }
  toggleFullscreen() {
    if (this.state.fullscreen) {
      document.webkitExitFullscreen();
    } else {
      document.getElementById("main").webkitRequestFullScreen();
    }
    this.setState({fullscreen: !this.state.fullscreen});
  }
  togglePause(e) {
    e.target.blur();

    this.state.pause ? this.engines.map(engine => engine.play()) : this.engines.map(engine => engine.pause())

    if (!this.state.duration) return;
    this.mpv.property("pause", !this.state.pause);
  }
  handleStop(e) {
    e.target.blur();
    this.engines.map(engine => engine.seek())
    this.mpv.property("pause", true);
    this.mpv.command("stop");
    this.setState({"time-pos": 0, duration: 0});
  }
  handleSeekMouseDown() {
    this.seeking = true;
  }
  handleSeek(e) {
    e.target.blur();

    this.engines.map(engine => engine.seek())

    const timePos = +e.target.value;
    this.setState({"time-pos": timePos});
    this.mpv.property("time-pos", timePos);
  }
  handleSeekMouseUp() {
    this.seeking = false;
  }
  handleSubtitleLoad(e) {
    e.target.blur();
    const items = remote.dialog.showOpenDialog({filters: [
      {name: "ASS", extensions: ["ass"]},
      {name: "All files", extensions: ["*"]},
    ]});

    if (items) {
      console.log(items)
      //this.bilibiliDanmakuLoad(items[0]);
    fs.readFile(items[0], (err, file) => {
      if (err) {
        return alert(err)
      }
      console.log(file)

      //this.engines.map(engine => engine.loader(file))
      this.engines[1].loader(file)

      //return file
    })

    }
  }
  handleDanmakuLoad(e) {
    e.target.blur();
    const items = remote.dialog.showOpenDialog({filters: [
      {name: "Danmaku", extensions: ["xml"]},
      {name: "All files", extensions: ["*"]},
    ]});

    if (items) {
      this.bilibiliDanmakuLoad(items[0]);
    }
  }
  handleLoad(e) {
    e.target.blur();
    const items = remote.dialog.showOpenDialog({filters: [
      {name: "Videos", extensions: ["mkv", "webm", "mp4", "mov", "avi"]},
      {name: "All files", extensions: ["*"]},
    ]});
    if (items) {

      console.log(items[0])

      let video = document.getElementById('ipc-video')
      video.currentTime = 0

      this.engines.push(new Vvideo(video))
      this.engines.push(new Ass(video))
      this.engines.push(new DanmakuDOM(video))
      console.log(this.engines)
      //this.engines.map(engine => engine.loader(items[0]))
      this.engines[2].loader(items[0])

      console.log(document.getElementById('progress').value)

      this.mpv.command("loadfile", items[0]);
    }
  }
  render() {
    return (
      <div className="container" style={{ cursor: this.state.cursor }} onMouseMove={ this.handleMouse }>
        <div id="ipc-video"></div>
        <div id="danmaku"></div>
        <div id="ass"></div>
        <ReactMPV
          className="player"
          onReady={this.handleMPVReady}
          onPropertyChange={this.handlePropertyChange}
          onMouseDown={this.togglePause}
        />

        <div className="controls">
          <button className="control" onClick={this.togglePause}>
            {this.state.pause ? "▶" : "❚❚"}
          </button>
          <button className="control" onClick={this.handleStop}>■</button>
          <input
            id="progress"
            className="seek"
            type="range"
            min={0}
            step={0.1}
            max={this.state.duration}
            value={this.state["time-pos"]}
            currenttime={this.state["time-pos"]}
            onChange={this.handleSeek}
            onMouseDown={this.handleSeekMouseDown}
            onMouseUp={this.handleSeekMouseUp}
          />
          <button className="control" onClick={this.handleLoad}>⏏</button>
          <button className="control" onClick={this.handleDanmakuLoad}>弹</button>
          <button className="control" onClick={this.handleSubtitleLoad}>字</button>
          <button className="control" onClick={this.toggleFullscreen}>{ this.state.fullscreen ? "Esc" : "Full" }</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById("main"));

