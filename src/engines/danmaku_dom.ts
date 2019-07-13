import Danmaku from "danmaku";

import Engine from '../cores/engine';
import ACPlayer from "../plugins/acplayer";

export default class DanmakuDOM extends Engine {
  constructor(time: () => number) {
    super()
    this.engine = (new Danmaku()).init({
      container: document.getElementById('danmaku'),
      comments: []
    })
    this.pool = []
    this.dispatcher = {}
    this.time = time

    this.play = this.play.bind(this)
    this.seek = this.seek.bind(this)
  }
  loader(path) {
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
      //var t = document.getElementById("progress").value
      let time = this.time()
      const result = comments.filter(word => word.time < time);

      // 差集 （减去发送的弹幕）
      comments = comments.filter(v => result.indexOf(v) == -1 )

      //console.log(result)
      result.map(r => this.engine.emit(r));

    }, 1000);
  }
  play() {
    this.private_load();
    return true;
  }
  pause() {}
  seek() {
    clearInterval(this.dispatcher)

    //var t = document.getElementById("progress").value
    let time = this.time()
    let comments = this.pool.filter(word => word.time >= time)
    //console.log(comments)

    this.private_load(comments);
  }
  resize() {
    this.engine.resize();
  }
}

