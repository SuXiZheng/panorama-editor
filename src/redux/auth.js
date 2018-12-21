import { combineReducers } from "redux";
import immutable from "immutable";

const SET_TOKEN = "SET_TOKEN";
const setToken = token => async dispatch => {
  return dispatch({ type: SET_TOKEN, token });
};

export const actions = {
  setToken
};

const initialState = immutable.Map({
  token: null
});
export default combineReducers({
  token: (state = initialState, action) => {
    if (action.type === SET_TOKEN) {
      state = state.set("token", action.token);
    }
    return state;
  }
});
