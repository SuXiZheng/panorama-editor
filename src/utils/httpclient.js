const defaultOptions = {
  mode: "cors",
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  redirect: "follow",
  referrer: "no-referrer"
};

export function ajax(url, actionTypes, options = {}) {
  return async (dispatch, getState) => {
    const {
      auth: { token }
    } = getState();
    const newOptions = Object.assign(
      {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        redirect: "follow",
        referrer: "no-referrer"
      },
      options
    );
    newOptions.headers.token = token.get("token");
    if (newOptions.body) {
      newOptions.body = JSON.stringify(newOptions.body);
    }
    dispatch({ type: actionTypes.start });
    try {
      const json = await request(url, newOptions);
      dispatch({
        type: actionTypes.success,
        payload: json
      });
    } catch (error) {
      dispatch({
        type: actionTypes.failure,
        message: error.message
      });
    }
  };
}

export default function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const newOptions = Object.assign(
      {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
          // "token":
          //   "CYxjLs0tcz2UbVnAD+yE++6cZk+hv8kfOlMYxq8vNSqOfi7Gi0b8kIRzgV3oe/B0YXD6Zr7Ybbeo2CPiaCwGU7HNNJLj0/c5J/Z4kYrFo4wECGbJhvffYURn6vZA9TwQLThB2YrW43jU41jUtw9jlvQTCFq67kCarmUoteMUPorpbrzWfRG+moI/Q6CpVRE9"
          // // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow",
        referrer: "no-referrer"
      },
      options
    );
    fetch(url, newOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response.text();
        }
      })
      .then(json => resolve(json))
      .catch(error => {
        if (error instanceof TypeError) {
          reject({ message: error.message });
        } else if (error instanceof Promise) {
          error.then(errorMessage => {
            reject({ message: errorMessage });
          });
        }
      });
  });
}
