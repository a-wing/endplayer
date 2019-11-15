import { ADD_OPT, TOGGLE_OPT } from "./actionTypes";

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

