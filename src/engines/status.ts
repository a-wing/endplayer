import Engine from '../cores/engine';

/**
* virtual video
*
* Element -> HTMLElement -> HTMLMediaElement -> HTMLVideoElement
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

export default class Status extends Engine {
  constructor(video: any) {
    super()

    this.engine = document.getElementById('status')
    this.engine.style.visibility = "visible"
    this.engine.style.opacity = 1
    this.engine.style.transition = "all 0.5s linear"

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }
  play() {
    this.engine.style.visibility = "hidden"
    this.engine.style.opacity = 0
    return true
  }
  pause() {
    this.engine.style.visibility = "visible"
    this.engine.style.opacity = 1
  }
}

