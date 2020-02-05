import { combineReducers } from "redux";
import settings from "./settings";
import opt from "./opt";
import media from "./media";

export default combineReducers({ settings, opt, media });

