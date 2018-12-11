import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import PanoramaEditor from "./routes/panoramaeditor/panoramaeditor";

class App extends Component {
  render() {
    return <div>{process.env.REACT_APP_API_URL}</div>;
    return <PanoramaEditor />;
  }
}

export default App;
