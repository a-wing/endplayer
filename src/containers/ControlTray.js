import React from "react";
import { connect } from "react-redux";
import { addOpt } from "../tsc/redux/actions";

class ControlTray extends React.Component {
  constructor(props) {
    super(props);
  }
  handleLoad = () => {
    this.props.addOpt(this.props.loaders, opt => { this.props.handleLoad(opt); console.log(`<== DONE ${opt} DONE ==>`) });
  };
  render() {
    return (
        <endplayer-controls-tray>
          <endplayer-button-group>
            <button onClick={this.props.togglePause}>
              <img src={this.props.state.pause ? "./assets/play.svg" : "./assets/pause.svg"} />
            </button>
              <endplayer-controls-time>{ parseInt(this.props.state["time-pos"]) }/{ parseInt(this.props.state.duration) }</endplayer-controls-time>
          </endplayer-button-group>
          <endplayer-button-group>
            <button onClick={this.handleLoad}>
              <img src="./assets/open.svg" />
            </button>
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
  { addOpt }
)(ControlTray);

