import React from "react";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef()
  }
  componentDidMount() {
    this.dialog.current.showModal()
  }
  render() {
    return (
      <dialog ref={this.dialog} >
        <div>select. please</div>
        <ul>
          {this.props.list.map((value, index) => {
            return <li onClick={() => this.props.toggleList([value])} key={index}>{value}</li>
          })}
        </ul>
      </dialog>
    )
  }
}

export default ListItem

