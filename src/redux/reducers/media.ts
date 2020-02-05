import { TOGGLE_PAUSE, TOGGLE_FULLSCREEN } from '../actionTypes';

const media = (state, action) => {
  switch (action.type) {
    case TOGGLE_PAUSE: {
      return {
        pause: action.payload.pause,
        fullscreen: state.fullscreen
      }
    }
    case TOGGLE_FULLSCREEN: {
      return {
        pause: state.pause,
        fullscreen: action.payload.fullscreen
      }
    }
    default: {
      return {
        pause: false,
        fullscreen: false
      }
    }
  }
};

export default media;

