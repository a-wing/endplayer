import Danmaku from "danmaku";

import Engine from '../cores/engine';
import ACPlayer from "../plugins/acplayer";

/**
* HTMLVideoElement
*
* Element -> HTMLElement -> HTMLMediaElement -> HTMLVideoElement
*
* https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
* HTMLMediaElement.playbackRate
* HTMLMediaElement.currentTime
*
* https://developer.mozilla.org/en-US/docs/Web/API/Element
* Element.clientWidth
* Element.clientHeight
*
*
* Events -> Media_events
* https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
* play, pause, seeking
*/


export default class DanmakuDOM extends Engine {
  constructor(video: any) {
    super()

    video.playbackRate = 1

    this.engine = (new Danmaku()).init({
      container: document.getElementById('danmaku'),
      video: video,
      comments: []
    })

    //this.dispatcher = {}

    this.loader = this.loader.bind(this)
  }
  loader(path) {
    ACPlayer.search(path, (ok, matches) => {
      //console.log(matches)
      ACPlayer.getComments(matches[0].episodeId, (comments) => {
        this.dispatcher = ACPlayer.Parser(comments);

        this.dispatcher.map(r => this.engine.emit(r));
        console.log(this.dispatcher)
      });
    });
  }
  loadFile(file) {
    file.map(r => this.engine.emit(r));
  }
  resize() {
    this.engine.resize();
  }
}

