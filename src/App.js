import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import PanoramaEditor from "./routes/panoramaeditor/panoramaeditor";

class App extends Component {
  constructor(props) {
    super(props);
    fetch("/api/panoramafolders", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, cors, *same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "token":
          "CYxjLs0tcz2UbVnAD+yE++6cZk+hv8kfOlMYxq8vNSqOfi7Gi0b8kIRzgV3oe/B0YXD6Zr7Ybbeo2CPiaCwGU7HNNJLj0/c5J/Z4kYrFo4wECGbJhvffYURn6vZA9TwQLThB2YrW43jU41jUtw9jlvQTCFq67kCarmUoteMUPorpbrzWfRG+moI/Q6CpVRE9"
        // "Content-Type": "application/x-www-form-urlencoded",
      }
      // redirect: "follow", // manual, *follow, error
      // referrer: "no-referrer", // no-referrer, *client
      // body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(result => {
      console.info(result);
    });
  }
  render() {
    return <div>{process.env.REACT_APP_API_URL}</div>;
    return <PanoramaEditor />;
  }
}

export default App;
