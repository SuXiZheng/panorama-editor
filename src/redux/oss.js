import { combineReducers } from "redux";
import request, { ajax } from "../utils/httpclient";
import immutable from "immutable";

/** 
 * 查询OSS图片策略
*/
const GET_IMAGEPOLICY_ACTIONTYPES = {
  start: "GET_IMAGEPOLICY_START",
  success: "GET_IMAGEPOLICY_SUCCESS",
  failure: "GET_IMAGEPOLICY_FAILURE"
};
const getImagePolicy = token => {
  return ajax(`/api/signature?bucketType=2`, GET_IMAGEPOLICY_ACTIONTYPES, {
    method: "GET"
  });
};

export const actions = {
  getImagePolicy
};

const initialState = immutable.Map({
  isFetching: false,
  data: null,
  isError: false,
  errorMessage: ""
});
export default combineReducers({
  imagePolicy: (state = initialState, action) => {
    switch (action.type) {
      case GET_IMAGEPOLICY_ACTIONTYPES.start:
        state = state.set("isFetching", true);
        break;
      case GET_IMAGEPOLICY_ACTIONTYPES.success:
        state = state.set("isFetching", false);
        state = state.set("data", action.payload.Data[0]);
        break;
      case GET_IMAGEPOLICY_ACTIONTYPES.failure:
        state = state.set("isFetching", false);
        state = state.set("isError", true);
        state = state.set("errorMessage", action.message);
        break;
      default:
        break;
    }
    return state;
  }
});
