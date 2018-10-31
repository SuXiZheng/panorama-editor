import React from "react";
import PropTypes from "prop-types";
import { Card, CardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

export class Scene extends React.PureComponent {
  static propTypes = {
    scene: PropTypes.object
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
  }
  render() {
    const { classes, scene } = this.props;
    return (
      <Card>
        <CardMedia
          className={classes.scene}
          title={scene.title}
          image={scene.thumburl}
        />
      </Card>
    );
  }
}
