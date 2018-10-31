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
  CardActions,
  FormControlLabel
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { isEmpty, isEqual, cloneDeep } from "lodash";

const styles = theme => ({
  scenes_container: {
    display: "flex",
    alignItems: "flex-start"
  },
  card: {
    width: 345,
    marginRight: 10
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
    onSubmit: hotspot => {},
    onClose: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedSceneName: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    var stateForUpdating = {};
    if (isEqual(this.props.visible, nextProps.visible) === false) {
      stateForUpdating.visible = nextProps.visible;
    }
    if (
      isEmpty(nextProps.hotspot) === false &&
      isEqual(this.props.hotspot, nextProps.hotspot) === false
    ) {
      stateForUpdating.selectedSceneName =
        nextProps.hotspot.linkedscene || nextProps.scenes[0].name;
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
    var clonedHotspot = cloneDeep(this.props.hotspot);
    clonedHotspot.linkedscene = this.state.selectedSceneName;
    this.props.onSubmit(clonedHotspot);
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
          {this.props.hotspot.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>跳转至场景：</DialogContentText>
          <div className={classes.scenes_container}>
            {scenes.map((scene, sceneIndex) => {
              return (
                <Card className={classes.card} key={sceneIndex}>
                  <CardActionArea
                    onClick={() => {
                      this.setState({
                        selectedSceneName: scene.name
                      });
                    }}
                  >
                    <CardMedia
                      className={classes.media}
                      image={scene.thumburl}
                      title={scene.name}
                    />
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Radio
                            value={scene.name}
                            checked={isEqual(
                              scene.name,
                              this.state.selectedSceneName
                            )}
                          />
                        }
                        label={scene.title}
                      />
                    </CardContent>
                  </CardActionArea>
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
