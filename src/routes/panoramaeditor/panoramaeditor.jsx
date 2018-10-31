import React from "react";
import { cloneDeep, isEmpty, find, isEqual, findIndex } from "lodash";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  FormControlLabel,
  Radio,
  TextField,
  Divider
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import HotspotEditor from "./hotspoteditor";

const styles = {
  root: {
    width: 300,
    padding: 10
  },
  card: {
    maxWidth: 345,
    marginTop: 10
  },
  media: {
    height: 140
  },
  button: {
    marginRight: 10
  },
  operating_container: {
    marginBottom: 10
  }
};

class PanoramaEditor extends React.PureComponent {
  static defaultProps = {
    xml:
      "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/tour.xml"
  };

  constructor(props) {
    super(props);
    this.krpano = document.getElementById("krpanoSWFObject");
    this.container = document.getElementById("pano");
    this.state = {
      selectedHotspot: null,
      scenes: [],
      currentSceneIndex: 0,
      isDragging: false,
      hotspotEditorVisible: false
    };
  }
  componentDidMount() {
    this.setup();
  }

  panoloaded() {
    var scenes = this.krpano.get("scene").getArray();
    scenes.map(scene => {
      scene.hotspots = [];
    });
    this.setState({
      scenes: scenes
    });
  }

  sceneLoaded() {
    var clonedScenes = cloneDeep(this.state.scenes);
    var index = this.krpano.get("scene").getItem(this.krpano.get("xml.scene"))
      .index;
    clonedScenes[index].hotspots = this.krpano.get("hotspot").getArray();
    this.setState({
      clonedScenes,
      currentSceneIndex: index
    });
  }

  setup() {
    this.krpano.set("events.onxmlcomplete", this.panoloaded.bind(this));
    this.krpano.set("events.onnewscene", this.sceneLoaded.bind(this));
    this.krpano.call(`loadpano(${this.props.xml},null,MERGE,BLEND(1));`);
    //隐藏下方自带控制条
    this.krpano.set("layer[skin_layer].visible", false);
    this.krpano.set("layer[skin_btn_prev_fs].visible", false);
    this.krpano.set("layer[skin_btn_next_fs].visible", false);
    this.container.onmousemove = () => {
      this.moveHotspot();
    };
  }

  save() {
    debugger;
  }

  addHotspot() {
    var clonedScenes = cloneDeep(this.state.scenes);
    var hotspot = {
      name: `hs_${new Date().getTime()}`,
      ath: this.krpano.get("view.hlookat"),
      atv: this.krpano.get("view.vlookat"),
      url:
        "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/skin/vtourskin_hotspot.png"
    };
    clonedScenes[this.state.currentSceneIndex].hotspots.push(hotspot);
    this.setState(
      {
        scenes: clonedScenes
      },
      () => {
        this.krpano.call(`addhotspot(${hotspot.name})`);
        this.krpano.set(
          `hotspot[${hotspot.name}].url`,
          "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/skin/vtourskin_hotspot.png"
        );
        this.krpano.set(`hotspot[${hotspot.name}].ath`, hotspot.ath);
        this.krpano.set(`hotspot[${hotspot.name}].atv`, hotspot.atv);
        this.krpano.set(`hotspot[${hotspot.name}].distorted`, true);
        this.krpano.set(
          `hotspot[${hotspot.name}].ondown`,
          function(e) {
            this.setState({
              selectedHotspot: hotspot,
              isDragging: true
            });
          }.bind(this)
        );
        this.krpano.set(
          `hotspot[${hotspot.name}].onup`,
          function() {
            this.setState({
              selectedHotspot: null,
              isDragging: false
            });
          }.bind(this)
        );
        this.krpano.set(
          `hotspot[${hotspot.name}].onclick`,
          function() {
            this.setState({
              selectedHotspot: hotspot,
              isDragging: false,
              hotspotEditorVisible: true
            });
          }.bind(this)
        );
      }
    );
  }

  updateHotspot(hotspotForUpdating) {
    var clonedScenes = cloneDeep(this.state.scenes);
    var hotspotIndex = findIndex(
      clonedScenes[this.state.currentSceneIndex].hotspots,
      hotspot => isEqual(hotspot.name, hotspotForUpdating)
    );

    clonedScenes[this.state.currentSceneIndex].hotspots.splice(
      hotspotIndex,
      1,
      hotspotForUpdating
    );

    this.setState(
      {
        scenes: clonedScenes
      },
      () => {
        this.krpano.set(
          `hotspot[${hotspotForUpdating.name}].linkedscene`,
          hotspotForUpdating.linkedscene
        );
      }
    );
  }

  moveHotspot() {
    if (
      isEmpty(this.state.selectedHotspot) ||
      this.state.isDragging === false
    ) {
      return;
    }

    var pnt = this.krpano.screentosphere(
      this.krpano.get("mouse.x"),
      this.krpano.get("mouse.y")
    );

    this.krpano.set(
      "hotspot[" + this.state.selectedHotspot.name + "].ath",
      pnt.x
    );
    this.krpano.set(
      "hotspot[" + this.state.selectedHotspot.name + "].atv",
      pnt.y
    );
  }

  changeScene(sceneIndex) {
    this.setState(
      {
        currentSceneIndex: sceneIndex
      },
      () => {
        this.krpano.call(`loadscene(${this.state.scenes[sceneIndex].name})`);
      }
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.operating_container}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.addHotspot.bind(this)}
          >
            添加热点
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.save.bind(this)}
          >
            保存
          </Button>
        </div>
        <Divider />
        {this.state.scenes.map(scene => {
          return (
            <Card key={scene.index} className={classes.card} raised={true}>
              <CardActionArea
                onClick={e => {
                  this.changeScene(scene.index);
                }}
              >
                <CardMedia
                  image={scene.thumburl}
                  title={scene.title}
                  className={classes.media}
                />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Radio
                        value={scene.index}
                        checked={isEqual(
                          scene.index,
                          this.state.currentSceneIndex
                        )}
                      />
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
        })}
        <HotspotEditor
          visible={this.state.hotspotEditorVisible}
          scenes={this.state.scenes}
          hotspot={this.state.selectedHotspot}
          onSubmit={this.updateHotspot.bind(this)}
          onClose={() => {
            this.setState({
              hotspotEditorVisible: false
            });
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PanoramaEditor);
