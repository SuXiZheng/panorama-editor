import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./redux/index";
import { createLogger } from "redux-logger";

export default function configureStore(initialState = {}) {
  //   const middlewares = { thunk };
  //   if (
  //     process.env.NODE_ENV === "development" ||
  //     process.env.NODE_ENV === "test"
  //   ) {
  //     middlewares.logger = createLogger({
  //       diff: true
  //     });
  //   }
  return createStore(reducers, applyMiddleware(thunk, createLogger()));
}
