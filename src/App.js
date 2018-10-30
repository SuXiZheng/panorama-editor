import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import PanoramaEditor from "./routes/panoramaeditor/panoramaeditor";

class App extends Component {
  render() {
    return <PanoramaEditor />;
  }
}

export default App;
