const defaultOptions = {
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
};

export function getJSON(url, options = defaultOptions) {
  const newOptions = Object.assign(options, { method: "GET" });
  return request(url, newOptions);
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
          throw response;
        }
      })
      .then(json => resolve(json))
      .catch(response => {
        response.text().then(error => {
          const s = error;
          reject(s);
        });
      });
  });
}
