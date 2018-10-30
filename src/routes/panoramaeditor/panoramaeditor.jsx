import React from "react";
import { cloneDeep } from "lodash";
import { Button } from "@material-ui/core";

export class PanoramaEditor extends React.PureComponent {
  static defaultProps = {
    xml:
      "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/tour.xml"
  };

  constructor(props) {
    super(props);
    this.krpano = document.getElementById("krpanoSWFObject");
    this.state = {
      selectedHotspot: null,
      scenes: [],
      currentSceneIndex: 0
    };
  }
  componentDidMount() {
    this.setup();
  }

  init() {
    var scenes = this.krpano.get("scene").getArray();
    scenes.map(scene => {
      scene.hotspots = [];
    });

    var currentSceneIndex = this.krpano
      .get("scene")
      .getItem(this.krpano.get("xml.scene")).index;

    this.setState({
      scenes: scenes,
      currentSceneIndex: currentSceneIndex
    });
  }

  setup() {
    this.krpano.set("events.onloadcomplete", this.init.bind(this));
    this.krpano.call(`loadpano(${this.props.xml},null,MERGE,BLEND(1));`);
    //隐藏下方自带控制条
    this.krpano.set("layer[skin_layer].visible", !1);
    this.krpano.set("layer[skin_btn_prev_fs].visible", !1);
    this.krpano.set("layer[skin_btn_next_fs].visible", !1);
  }

  save() {}

  addHotspot() {
    var clonedScenes = cloneDeep(this.state.scenes);
    var hotspot = {
      name: `hs_${new Date().getTime()}`,
      ath: this.krpano.get("view.hlookat"),
      atv: this.krpano.get("view.vlookat"),
      url:
        "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/skin/vtourskin_hotspot.png"
    };
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
      }
    );

    // if (this.krpano) {
    //   var h = this.krpano.get("view.hlookat");
    //   var v = this.krpano.get("view.vlookat");
    //   var hs_name = "hs" + ((Date.now() + Math.random()) | 0); // create unique/randome name
    //   this.krpano.call("addhotspot(" + hs_name + ")");
    //   this.krpano.set(
    //     "hotspot[" + hs_name + "].url",
    //     "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/skin/vtourskin_hotspot.png"
    //   );
    //   this.krpano.set("hotspot[" + hs_name + "].ath", h);
    //   this.krpano.set("hotspot[" + hs_name + "].atv", v);
    //   this.krpano.set("hotspot[" + hs_name + "].distorted", true);

    //   if (this.krpano.get("device.html5")) {
    //     // for HTML5 it's possible to assign JS functions directly to krpano events
    //     this.krpano.set(
    //       "hotspot[" + hs_name + "].onclick",
    //       function(hs) {
    //         alert('hotspot "' + hs + '" clicked');
    //       }.bind(null, hs_name)
    //     );
    //   } else {
    //     // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
    //     this.krpano.set(
    //       "hotspot[" + hs_name + "].onclick",
    //       "js( alert(calc('hotspot \"' + name + '\" clicked')) );"
    //     );
    //   }
    //}
  }

  render() {
    return (
      <div style={{ width: 300 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.addHotspot.bind(this)}
        >
          添加热点
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={this.save.bind(this)}
        >
          保存
        </Button>
      </div>
    );
  }
}
