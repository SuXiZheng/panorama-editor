import React from "react";
import {
  cloneDeep,
  isEmpty,
  find,
  isEqual,
  findIndex,
  some,
  filter
} from "lodash";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import HotspotEditor from "./hotspoteditor";
import Uploader from "../../components/uploader/uploader";
import { AddAPhoto } from "@material-ui/icons";
import UploadProgressbar from "./uploadprogressbar";
import Scene from "./scene";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as ossActions } from "../../redux/oss";
import { actions as authActions } from "../../redux/auth";
import { actions as panoramaActions } from "../../redux/panorama";

const styles = {
  root: {
    width: 300,
    padding: 10,
    height: "calc(100% - 19px)",
    overflow: "auto",
    zIndex: 10,
    position: "relative"
  },
  card: {
    maxWidth: 345,
    marginTop: 10,
    minHeight: 220
  },
  uploadButtonArea: {
    height: 220,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  media: {
    height: 140
  },
  button: {
    marginRight: 10
  },
  operating_container: {
    marginBottom: 10
  },
  lodding: {
    width: "100%",
    height: "100%",
    zIndex: 11,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    background: "#94919180"
  }
};

class PanoramaEditor extends React.PureComponent {
  static defaultProps = {
    match: {
      params: {
        token:
          "CYxjLs0tcz2UbVnAD%2ByE%2B%2B6cZk%2Bhv8kfOlMYxq8vNSqOfi7Gi0b8kIRzgV3oe%2FB0YXD6Zr7Ybbeo2CPiaCwGU7HNNJLj0%2Fc5J%2FZ4kYrFo4wECGbJhvffYURn6vZA9TwQLThB2YrW43jU41jUtw9jlvQTCFq67kCarmUoteMUPorpbrzWfRG%2BmoI%2FQ6CpVRE9",
        materialId: "",
        xml:
          "http%3A%2F%2Fimages.muzhiyun.cn%2FPanoramaProjects%2F5c1754a8dc8e7e0108692cf3%2Ftour.xml"
      }
    }
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
      hotspotEditorVisible: false,
      isUploadingFiles: false
    };
    this.setToken(props);
  }
  componentDidMount() {
    this.setup();
  }

  componentWillReceiveProps(nextProos) {
    if (isEqual(this.props.match.params, nextProos.match.params) === false) {
      console.info(nextProos.match.params);
      this.setToken(nextProos);
    }
  }

  setToken(props = this.props) {
    props.authActions
      .setToken(decodeURIComponent(this.props.match.params.token))
      .then(() => {
        props.ossActions.getImagePolicy();
      });
  }

  // panoloaded() {
  //   var scenes = this.krpano.get("scene").getArray();
  //   scenes.map(scene => {
  //     scene.hotspots = [];
  //   });
  //   this.setState({
  //     scenes: scenes
  //   });
  // }

  sceneLoaded() {
    let scene = this.krpano.get("scene").getItem(this.krpano.get("xml.scene"));
    if (
      some(this.state.scenes, sceneItem => sceneItem.name === scene.name) ===
      false
    ) {
      const clonedScenes = cloneDeep(this.state.scenes);
      scene.hotspots = filter(
        this.krpano.get("hotspot").getArray(),
        hotspot =>
          hotspot.name !== "vr_cursor" &&
          hotspot.name !== "skin_webvr_prev_scene" &&
          hotspot.name !== "skin_webvr_next_scene"
      );
      clonedScenes.push(scene);
      this.setState({
        scenes: clonedScenes
      });
    }
  }

  setup() {
    const xml = `${decodeURIComponent(this.props.match.params.xml)}`;
    // this.krpano.set("events.onxmlcomplete", this.panoloaded.bind(this));
    this.krpano.set("events.onnewscene", this.sceneLoaded.bind(this));
    this.krpano.call(`loadpano(${xml},null,MERGE,BLEND(1));`);
    //隐藏下方自带控制条
    this.krpano.set("layer[skin_layer].visible", false);
    this.krpano.set("layer[skin_btn_prev_fs].visible", false);
    this.krpano.set("layer[skin_btn_next_fs].visible", false);
    this.container.onmousemove = () => {
      this.moveHotspot();
    };
  }

  save() {
    let sceneXmls = [];
    this.state.scenes.map(scene => {
      let sceneXml = `<scene name="${scene.name}" title="${
        scene.title
      }" onstart="" thumburl="${scene.thumburl}" lat="" lng="" heading="">
      ${scene.content}
      ${scene.hotspots.map(hotspot => {
        return `<hotspot name="${
          hotspot.name
        }" style="skin_hotspotstyle" ath="${hotspot.ath}" atv="${
          hotspot.atv
        }" linkedscene="${hotspot.linkedscene || ""}" />`;
      })}
      </scene>`;
      sceneXmls.push(sceneXml);
    });
    debugger;
  }

  createHotsptInKrpano = hotspot => {
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
  };

  createHotspot() {
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
        this.createHotsptInKrpano(hotspot);
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

    const clonedScenes = cloneDeep(this.state.scenes);
    const hotspot = find(
      clonedScenes[this.state.currentSceneIndex].hotspots,
      hotspot => hotspot.name === this.state.selectedHotspot.name
    );

    hotspot.ath = pnt.x;
    hotspot.atv = pnt.y;
    this.setState(
      {
        scenes: clonedScenes
      },
      () => {
        this.krpano.set(
          "hotspot[" + this.state.selectedHotspot.name + "].ath",
          pnt.x
        );
        this.krpano.set(
          "hotspot[" + this.state.selectedHotspot.name + "].atv",
          pnt.y
        );
      }
    );
  }

  onSceneChanged = () => {
    const hotspots = this.state.scenes[this.state.currentSceneIndex].hotspots;
    for (const hotspot in hotspots) {
      this.createHotsptInKrpano(hotspot);
    }
  };

  onSceneClick = scene => {
    this.setState(
      {
        currentSceneIndex: scene.index
      },
      () => {
        this.krpano.call(`loadscene(${this.state.scenes[scene.index].name})`);
        this.onSceneChanged();
      }
    );
  };

  onFilesUploading = () => {
    this.setState({
      isUploadingFiles: true
    });
  };

  onFilesUploaded = files => {
    this.setState(
      {
        isUploadingFiles: false
      },
      async () => {
        await this.props.panoramaActions.makeNewScenes(
          this.props.match.params.materialId,
          files
        );
        window.location.reload();
        // this.setup();
      }
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.operating_container}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.createHotspot.bind(this)}
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
          const isSelected = scene.index === this.state.currentSceneIndex;
          return (
            <Scene
              scene={scene}
              onClick={this.onSceneClick}
              isSelected={isSelected}
            />
          );
        })}

        <Uploader
          uploadButton={
            <Card className={classes.card} raised={true}>
              <CardActionArea className={classes.uploadButtonArea}>
                <AddAPhoto style={{ fontSize: 70 }} />
              </CardActionArea>
            </Card>
          }
          progressbar={<UploadProgressbar />}
          removeButtonVisible={false}
          style={{
            display: "flex",
            flexDirection: "column"
          }}
          uploadButtonStyle={{
            order: 2
          }}
          progressbarContainerStyle={{
            order: 1
          }}
          onUploading={this.onFilesUploading}
          onSuccess={this.onFilesUploaded}
        />

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

        {(this.state.isUploadingFiles || this.props.isMakingNewScenes) && (
          <div className={classes.lodding}>
            {this.state.isUploadingFiles && <span>全景图上传中...</span>}
            {this.props.isMakingNewScenes && <span>新场景创建中...</span>}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isMakingNewScenes: state.panorama.makeNewScenes.get("isFetching")
});

const mapDispatchToProps = dispatch => {
  return {
    ossActions: bindActionCreators(ossActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch),
    panoramaActions: bindActionCreators(panoramaActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PanoramaEditor));
