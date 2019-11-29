import * as React from "react";

class TimeDigitalProgress extends React.Component {
  props: {
    currentTime: number,
    duration: number,
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        { formatSecond(this.props.currentTime) }/{ formatSecond(this.props.duration) }
      </>
    )
  }
}

function formatSecond(second: number): string {
  const h = Math.floor((second / 3600) % 24);
  const m = Math.floor((second / 60) % 60);
  const s = Math.floor(second % 60);
  let result = s.toString();
  if (m > 0) {
    result = m.toString() + ":" + result;
  }
  if (h > 0) {
    result = h.toString() + ":" + result;
  }

  return result;
}


export default TimeDigitalProgress

