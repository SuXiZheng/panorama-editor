import React from "react";

export class PanoramaEditor extends React.PureComponent {
  static defaultProps = {
    xml:
      "http://infomedia-image.oss-cn-beijing.aliyuncs.com/huogh001/9ee788f8-5462-4d43-96ab-70d7b6821814/tour.xml"
  };

  constructor(props) {
    super(props);
    this.krpano = document.getElementById("krpanoSWFObject");
    this.setup();
  }
  componentDidMount() {}

  setup() {
    this.krpano.call(`loadpano(${this.props.xml},null,MERGE,BLEND(1));`);
  }

  render() {
    return <div>sdfs</div>;
  }
}
