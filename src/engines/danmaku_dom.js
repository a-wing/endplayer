import Danmaku from "danmaku";

//const ACPlayer = require('../plugins/acplayer')
import ACPlayer from "../plugins/acplayer";

// [
//  init
//  loading
//  play
//  pause
//  seek
//  resize
// ]

export default class DanmakuDOM {
  constructor() {
    this.engine = (new Danmaku()).init({
      container: document.getElementById('danmaku'),
      comments: []
    })
    this.pool = []
    this.dispatcher = {}

    this.play = this.play.bind(this)
    this.seek = this.seek.bind(this)
  }
  loading(path) {
    ACPlayer.search(path, (ok, matches) => {
      //console.log(matches)
      ACPlayer.getComments(matches[0].episodeId, (comments) => {
        this.pool = ACPlayer.Parser(comments);
        console.log(this.pool)
      });
    });
  }
  private_load(comments = this.pool) {
    this.dispatcher = setInterval(() => {
      var t = document.getElementById("progress").value
      const result = comments.filter(word => word.time < t);

      // 差集 （减去发送的弹幕）
      comments = comments.filter(v => result.indexOf(v) == -1 )

      //console.log(result)
      result.map(r => this.engine.emit(r));

    }, 1000);
  }
  play() {
    this.private_load();
  }
  pause() {}
  seek() {
    clearInterval(this.dispatcher)

    var t = document.getElementById("progress").value
    let comments = this.pool.filter(word => word.time >= t)
    //console.log(comments)

    this.private_load(comments);
  }
  resize() {
    this.engine.resize();
  }
}

