import { ADD_OPT, TOGGLE_OPT, CHANGE_SETTINGS } from "../actionTypes";

const setting = (state, action) => {
  switch (action.type) {
    case CHANGE_SETTINGS: {
      return {
        ...action.payload.content,
      }
    }
    default: {
      return {
        is_dev: false,
      }
    }
  }
};

export default setting;

