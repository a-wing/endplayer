import { ADD_OPT, TOGGLE_OPT, CHANGE_SETTINGS, TOGGLE_PAUSE, TOGGLE_FULLSCREEN } from "./actionTypes";

export const addOpt = (content, callback) => ({
  type: ADD_OPT,
  payload: {
    content,
    callback
  }
});

export const toggleOpt = (content, callback) => ({
  type: TOGGLE_OPT,
  payload: {
    content,
    callback
  }
});


export const changeSettings = (content, callback) => ({
  type: CHANGE_SETTINGS,
  payload: {
    content
  }
});


export const onPause = (pause) => ({
  type: TOGGLE_PAUSE,
  payload: {
    pause
  }
});


