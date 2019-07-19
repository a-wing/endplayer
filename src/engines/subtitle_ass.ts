import ASS from "assjs";

import Engine from '../cores/engine';
//import ACPlayer from "../plugins/acplayer";


/**
* HTMLVideoElement
*
* HTMLElement -> HTMLMediaElement -> HTMLVideoElement
*
* https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
* HTMLVideoElement.videoHeight :only
* HTMLVideoElement.videoWidth :only
*
* HTMLMediaElement.paused :only
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

export default class SubtitleAss extends Engine {
  constructor(video: any) {
    super()
    this.engine = {}

    //this.dispatcher = {}
    //let video = document.createElement('div');
    //video.paused = false
    video.paused = false
    video.videoWidth = 1280
    video.videoHeight = 720
    //video.clientWidth = 640
    //video.clientHeight = 480

    this.dispatcher = video

    this.loader = this.loader.bind(this)
  }
  loader(path) {
   this.engine = new ASS(path.toString(), this.dispatcher, {
      container: document.getElementById('ass'),
      resampling: 'video_width'
    })
  }
  resize() {
    this.engine.resize();
  }
}

