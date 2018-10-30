import React from "react";
import PropTypes from "prop-types";
import {
  GridList,
  GridListTile,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  GridListTileBar,
  Button,
  DialogActions,
  Radio,
  CardActionArea,
  CardMedia,
  Card,
  CardContent,
  Typography,
  CardActions
} from "@material-ui/core";
import { StarBorder } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { isEmpty, isEqual } from "lodash";

const styles = theme => ({
  scenes_container: {
    display: "flex",
    alignItems: "flex-start"
  },
  card: {
    width: 345
  },
  media: {
    height: 140
  }
});

class HotspotEdtior extends React.PureComponent {
  static propTypes = {
    isEdit: PropTypes.bool,
    hotspot: PropTypes.object,
    scenes: PropTypes.array,
    onClose: PropTypes.func
  };

  static defaultProps = {
    isEdit: false,
    onClose: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    var stateForUpdating = {};
    if (isEqual(this.props.visible, nextProps.visible) === false) {
      stateForUpdating.visible = nextProps.visible;
    }
    this.setState(stateForUpdating);
  }

  close() {
    this.setState(
      {
        visible: false
      },
      () => {
        this.props.onClose();
      }
    );
  }

  submit() {
    this.close();
  }

  render() {
    const { classes, scenes } = this.props;
    if (isEmpty(this.props.hotspot)) {
      return <div />;
    }
    return (
      <Dialog
        open={this.state.visible}
        onClose={this.close.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          编辑热点
          {this.props.hotspot.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>跳转至场景：</DialogContentText>
          <div className={classes.scenes_container}>
            {scenes.map((scene, sceneIndex) => {
              return (
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={scene.thumburl}
                      title={scene.name}
                    />
                    <CardContent>
                      {/* <Typography gutterBottom variant="h5" component="h2">
                        {scene.title}
                      </Typography>
                      <Typography gutterBottom> */}
                      <Radio>{scene.title}</Radio>
                      {/* </Typography> */}
                    </CardContent>
                  </CardActionArea>
                  {/* <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions> */}
                </Card>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.close.bind(this)} color="primary">
            取消
          </Button>
          <Button onClick={this.submit.bind(this)} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HotspotEdtior);
