import React from "react";

import produce from "immer";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings : this.props.settings || {} }
    //this.state = { settings : { engines: {
    //  //test: "2333333",
    //  test_f: {
    //    test_s: "DDDDDDDD",
    //    tt: "xxxxx",
    //    t: true
    //  },
    //  //danmuku_acplayer: { auto_match: true }
    //}} }
    this.dialog = React.createRef()
  }
  componentDidMount() {
    this.dialog.current.showModal()
  }
  handleSwitch = (index, value) => {
    for (const [fKey, fValue] of Object.entries(this.state.settings)) {
      if (fKey === "engines") {
        for (const [k, v] of Object.entries(fValue)) {
          if (k === index[0]) {
            for (const [g, s] of Object.entries(v)) {
              if (g === index[1]) {

                const nextState = produce(this.state.settings, draftState => {
                  draftState.engines[k][g] = value
                })
                this.handleSubmit(nextState)
                this.setState({ settings: nextState })
                //setTimeout(() => { console.log(this.state.settings)}, 1000)

              }
            }
          }
        }
      }
    }
  }
  handleSubmit = settings => {
    this.props.save(settings)
  }
  handleCancel = () => {
    this.props.cancel()
  }
  render() {
    return (
      <dialog ref={this.dialog} >
        <h5>Setting</h5>
        {Object.entries(this.state.settings).map(([key, value], index) => {
          return key === "engines" ? <EngineSettings key={index} category={value} toggleSwitch={this.handleSwitch} /> : null
        })}
        <br/>
        <button onClick={this.handleCancel}>
          Cancel
        </button>
      </dialog>
    )
  }
}

const EngineSettings = ({category, toggleSwitch}) => (
  <>
  {Object.entries(category).map(([key, value], index) => {
    return <GroupSettings key={index} category={key} group={value} toggleSwitch={toggleSwitch} />
  })}
  </>
)

const GroupSettings = ({category, group, toggleSwitch}) => (
  <label>
  {Object.entries(group).map(([key, value], index) => {
    return <div key={index} ><input checked={value} type={(typeof value === "boolean") ? "checkbox" : "text"} onChange={e => toggleSwitch([category, key], e.target.checked)} key={index} value={value} />{category + "#" + key}<br/></div>
  })}
  </label>
)

export default Settings

