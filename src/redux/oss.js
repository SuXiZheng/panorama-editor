import { combineReducers } from "redux";
import request, { getJSON } from "../utils/httpclient";

const GET_IMAGEPOLICY_ACTIONTYPES = {
  start: "GET_IMAGEPOLICY_FETCH_START",
  success: "GET_IMAGEPOLICY_FETCH_SUCCESS",
  failure: "GET_IMAGEPOLICY_FETCH_FAILURE"
};
const getImagePolicy = () => async (dispatch, getState) => {
  dispatch({ type: GET_IMAGEPOLICY_ACTIONTYPES.start });
  try {
    const json = await request("http://localhost:4000/upload");
    dispatch({
      type: GET_IMAGEPOLICY_ACTIONTYPES.success,
      payload: json
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_IMAGEPOLICY_ACTIONTYPES.failure, error });
  }
};

export const actions = {
  getImagePolicy
};

export default combineReducers({
  imagePolicy: (state = {}, action) => {
    switch (action.type) {
      case GET_IMAGEPOLICY_ACTIONTYPES.failure:
        const s = action.error;
        return state;
        break;
      case GET_IMAGEPOLICY_ACTIONTYPES.success:
        return state;
      default:
        return state;
    }
  }
});
