import Engine from '../cores/engine';

/**
* virtual video
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

export default class Vvideo extends Engine {
  constructor(video: any) {
    super()

    this.engine = video
    //this.dispatcher = {}

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.seek = this.seek.bind(this)
  }
  play() {
    let event = document.createEvent('Event');
    event.initEvent('play', true, true);
    this.engine.dispatchEvent(event);

    //console.log("play")

    this.dispatcher = setInterval(() => {
      // @ts-ignore
      this.engine.currentTime = document.getElementById('progress').value
      //console.log(document.getElementById('progress').value)
    }, 100);

    return true;
  }
  pause() {
    clearInterval(this.dispatcher)

    let event = document.createEvent('Event');
    event.initEvent('pause', true, true);

    this.engine.dispatchEvent(event);
  }
  seek() {
    let event = document.createEvent('Event');
    event.initEvent('seeking', true, true);

    this.engine.dispatchEvent(event);
  }
}

