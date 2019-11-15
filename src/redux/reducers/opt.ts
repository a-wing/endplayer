import { ADD_OPT, TOGGLE_OPT } from "../actionTypes";

const opt = (state, action) => {
  switch (action.type) {
    case ADD_OPT: {
      return {
        items: action.payload.content,
        callback: action.payload.callback
      }
    }
    case TOGGLE_OPT: {
      action.payload.callback(action.payload.content)
      return {
        items: [],
        callback: () => {}
      }
    }
    default: {
      return {
        items: [],
        callback: () => {}
      }
    }
  }
};

export default opt;

