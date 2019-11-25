import React from "react";
import { connect } from "react-redux";
import { changeSettings } from "../tsc/redux/actions";

import { ipcRenderer } from 'electron';

import Settings from "../components/Settings";

class ButtonSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {setting: false};
  }
  componentDidMount() {
    ipcRenderer.on('setting', (event, arg) => {
      this.props.changeSettings(arg);
    })
    ipcRenderer.send('setting', 'get')
  }
  handleSettings = () => {
    //this.props.settings.is_dev
    //  ? this.props.changeSettings({is_dev: false}, setting => { console.log(setting) })
    //  : this.props.changeSettings({is_dev: true}, setting => { console.log(setting) })

    //console.log(this.state.setting)
    this.setState({
      setting: !this.state.setting
    });
  };
  save = params => {
    ipcRenderer.send('setting', params)
  }
  cancel = () => {
    this.handleSettings()
  }
  render() {
    return (
      <div>
        {this.state.setting ? <Settings settings={this.props.settings} save={this.save} cancel={this.cancel} /> : null}
        <button onClick={this.handleSettings}>
          <img src={this.props.imgSrc} />
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { settings: state.settings };
};

export default connect(
  mapStateToProps,
  { changeSettings }
)(ButtonSettings);

