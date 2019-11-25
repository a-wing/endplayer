import { CHANGE_SETTINGS } from "../actionTypes";

const settings = (state, action) => {
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

export default settings;

