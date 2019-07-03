"use strict";

const path = require("path");
const React = require("react");
const ReactDOM = require("react-dom");
const { remote } = require("electron");
const { ReactMPV } = require("mpv.js");

// danmaku
const Danmaku = require('danmaku')
const BilibiliParser = require('./src/bilibili')
const ACPlayer = require('./src/acplayer')

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

    // danmaku
    this.danmaku = null;
    this.handleDanmakuLoad = this.handleDanmakuLoad.bind(this);
    this.danmakuLoad = this.danmakuLoad.bind(this);
    this.loadLocalFile = this.loadLocalFile.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
    this.state = { cursor: 'none' };
    this.timer = null;
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
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
  danmakuLoad(file) {

    var danmaku = new Danmaku();
    var comments = file;
    console.log(comments)
    danmaku.init({
      container: document.getElementById('danmaku'),
      comments: []
    });

    setInterval(() => {
      var t = document.getElementById("progress").value
      const result = comments.filter(word => word.time < t);

      // 差集 （减去发送的弹幕）
      comments = comments.filter(v => result.indexOf(v) == -1 )

      //console.log(result)
      result.map(r => danmaku.emit(r));

    }, 1000);
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
    if (!this.state.duration) return;
    this.mpv.property("pause", !this.state.pause);
  }
  handleStop(e) {
    e.target.blur();
    this.mpv.property("pause", true);
    this.mpv.command("stop");
    this.setState({"time-pos": 0, duration: 0});
  }
  handleSeekMouseDown() {
    this.seeking = true;
  }
  handleSeek(e) {
    e.target.blur();
    const timePos = +e.target.value;
    this.setState({"time-pos": timePos});
    this.mpv.property("time-pos", timePos);
  }
  handleSeekMouseUp() {
    this.seeking = false;
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

      const filepath = items[0];
      ACPlayer.search(filepath, (ok, matches) => {
        console.log(matches)
        ACPlayer.getComments(matches[0].episodeId, (comments) => {
          //console.log(comments)
          //console.log(acplayerParser(row));
          //console.log(ACPlayer.acplayerParser(comments));
          this.danmakuLoad(ACPlayer.acplayerParser(comments));
        });
      });

      this.mpv.command("loadfile", items[0]);
    }
  }
  render() {
    return (
      <div className="container" style={{ cursor: this.state.cursor }} onMouseMove={ this.handleMouse }>
        <div id="danmaku"></div>
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
            onChange={this.handleSeek}
            onMouseDown={this.handleSeekMouseDown}
            onMouseUp={this.handleSeekMouseUp}
          />
          <button className="control" onClick={this.handleLoad}>⏏</button>
          <button className="control" onClick={this.handleDanmakuLoad}>弹</button>
          <button className="control" onClick={this.toggleFullscreen}>{ this.state.fullscreen ? "Esc" : "Full" }</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById("main"));

