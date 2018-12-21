import { combineReducers } from "redux";
import oss from "./oss";
import auth from "./auth";
import panorama from "./panorama";

export default combineReducers({
  oss: oss,
  auth: auth,
  panorama: panorama
});
