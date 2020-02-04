import hotkeys from 'hotkeys-js';

import * as React from "react";
import { connect } from "react-redux";
import { addOpt } from "./redux/actions";

let KeyMap = {
  openFile: 'ctrl+o'
}

class HotKey extends React.PureComponent {
  constructor(props) {
    super(props);

    hotkeys(KeyMap.openFile, (event, handler) => {
      // @ts-ignore
      this.props.addOpt(this.props.loaders, opt => { this.props.handleLoad(opt); console.log(`<== DONE ${opt} DONE ==>`) });
    });

  }
  render() {
    return (<></>)
  }
}

export default connect(
  null,
  { addOpt }
)(HotKey);

