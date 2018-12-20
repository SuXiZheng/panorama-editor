import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Radio,
  TextField,
  CardActionArea
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { isEqual, cloneDeep } from "lodash";

const styles = theme => ({
  scene: {},
  card: {
    maxWidth: 345,
    marginTop: 10,
    minHeight: 220
  },
  media: {
    height: 140
  }
});

class Scene extends React.PureComponent {
  static propTypes = {
    scene: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool
  };
  static defaultProps = {
    onClick: () => {},
    isSelected: false
  };

  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.onClick(this.props.scene);
  };

  render() {
    const { classes, scene } = this.props;
    return (
      <Card className={classes.card} raised={true}>
        <CardActionArea onClick={this.onClick}>
          <CardMedia
            className={classes.media}
            title={scene.title}
            image={scene.thumburl}
          />
          <CardContent>
            <FormControlLabel
              control={
                <Radio value={scene.index} checked={this.props.isSelected} />
              }
              label={
                <TextField
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  defaultValue={scene.title}
                  placeholder="请输入场景标题"
                  required={true}
                />
              }
            />
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(Scene);
