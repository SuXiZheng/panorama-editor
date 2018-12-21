import { combineReducers } from "redux";
import { ajax } from "../utils/httpclient";
import immutable from "immutable";

/**
 * 添加新场景
 */
const MAKE_NEWSCENES_ACTIONTYPES = {
  start: "MAKE_NEWSCENES_START",
  success: "MAKE_NEWSCENES_SUCCESS",
  failure: "MAKE_NEWSCENES_FAILURE"
};
function makeNewScenes(materialId, images) {
  return ajax(
    `/api/panoramas/${materialId}/images`,
    MAKE_NEWSCENES_ACTIONTYPES,
    {
      body: { images }
    }
  );
}

export const actions = {
  makeNewScenes
};

const initialState = immutable.Map({
  isFetching: false,
  data: null,
  isError: false,
  errorMessage: ""
});
export default combineReducers({
  makeNewScenes: (state = initialState, action) => {
    switch (action.type) {
      case MAKE_NEWSCENES_ACTIONTYPES.start:
        state = state.set("isFetching", true);
        break;
      case MAKE_NEWSCENES_ACTIONTYPES.success:
        state = state.set("isFetching", false);
        state = state.set("data", action.payload.Data[0]);
        break;
      case MAKE_NEWSCENES_ACTIONTYPES.failure:
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
