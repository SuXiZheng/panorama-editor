import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import PanoramaEditor from "./pages/panoramaeditor/panoramaeditor";
import { Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const styles = {
  root: {
    height: "100%"
  }
};

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route exact path="/:token/:xml" component={PanoramaEditor} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
