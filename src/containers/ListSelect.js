import React from "react";
import { connect } from "react-redux";
import Opt from "../components/ListSelect";

import { addOpt, toggleOpt } from "../tsc/redux/actions";

function SelectApp({opt, toggleOpt}) {
  return (
    <div className="select-app">
    { opt.items.length == 0 ? null : <Opt list={opt.items} toggleList={i => { toggleOpt(i, opt.callback) }}/> }
    </div>
  );
}

const mapStateToProps = state => {
  return { opt: state.opt };
};

export default connect(mapStateToProps, { toggleOpt })(SelectApp);
