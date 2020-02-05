import React from "react";
import { connect } from "react-redux";
import { addOpt, onPause } from "../tsc/redux/actions";

import ButtonSettings from "./ButtonSettings";
import TimeDigitalProgress from "../tsc/components/TimeDigitalProgress";

class ControlTray extends React.Component {
  constructor(props) {
    super(props);
  }
  handleLoad = () => {
    this.props.addOpt(this.props.loaders, opt => { this.props.handleLoad(opt); console.log(`<== DONE ${opt} DONE ==>`) });
  }
  pause = () => {
    this.props.onPause(true)
    this.props.togglePause()
  }
  render() {
    return (
        <endplayer-controls-tray>
          <endplayer-button-group>
            <button onClick={this.pause}>
              <img src={this.props.state.pause ? "./assets/play.svg" : "./assets/pause.svg"} />
            </button>
            <endplayer-controls-time>
              <TimeDigitalProgress currentTime={ parseInt(this.props.state["time-pos"]) || 0 } duration={ parseInt(this.props.state.duration) || 0 } />
            </endplayer-controls-time>
          </endplayer-button-group>
          <endplayer-button-group>
            <button onClick={this.handleLoad}>
              <img src="./assets/open.svg" />
            </button>
            <ButtonSettings imgSrc="./assets/settings.svg" />
            <button onClick={this.props.toggleFullscreen}>
              <img src={this.props.state.fullscreen ? "./assets/window.svg" : "./assets/full.svg"} />
            </button>
          </endplayer-button-group>
        </endplayer-controls-tray>
    );
  }
}
            //<button onClick={this.handleDanmakuLoad}>
            //  <img src="./assets/danmaku.svg" />
            //</button>
            //<button onClick={this.handleSubtitleLoad}>
            //  <img src="./assets/subtract.svg" />
            //</button>

export default connect(
  null,
  { addOpt, onPause }
)(ControlTray);

