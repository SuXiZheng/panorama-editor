import React from "react";
import PropTypes from "prop-types";
import { isEmpty, merge, cloneDeep } from "lodash";
import { UploadTask } from "./task";
import styles from "./uploader.module.css";
import { Progressbar } from "./progressbar";
import path from "path";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as ossActions } from "../../redux/oss";

/**
 *上传组件
 *
 * @export
 * @class Uploader
 * @extends {React.PureComponent}
 */
class Uploader extends React.Component {
  static propTypes = {
    multiple: PropTypes.bool,
    // action: PropTypes.string.isRequired,
    accept: PropTypes.string,
    onUploading: PropTypes.func,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    uploadButton: PropTypes.object,
    removeButton: PropTypes.object,
    style: PropTypes.object,
    uploadButtonStyle: PropTypes.object,
    progressbarContainerStyle: PropTypes.object,
    progressbar: PropTypes.object,
    removeButtonVisible: PropTypes.bool
  };
  static defaultProps = {
    multiple: true,
    accept: "*",
    onUploading: () => {},
    onError: () => {},
    onSuccess: () => {},
    uploadButton: <button>上传</button>,
    removeButton: <span className={styles.removeIcon}>X</span>,
    style: {},
    removeButtonStyle: {},
    uploadButtonStyle: {},
    progressbarContainerStyle: {},
    progressbar: <Progressbar file="1" />,
    removeButtonVisible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
  }

  upload = (files = []) => {
    if (isEmpty(files)) {
      throw new Error("文件不能为空");
    }

    this.props.onUploading();

    var uploadTasks = [];
    var promises = [];

    files.map(file => {
      var uploadTask = new UploadTask(file, this.props.imagePolicy);
      uploadTask.onProgress = this.onProgress.bind(this);
      uploadTasks.push(uploadTask);
      promises.push(uploadTask.execAsync(this.props.imagePolicy.host));
    });

    this.setState({
      tasks: uploadTasks
    });

    Promise.all(promises)
      .then(result => {
        this.refresh();
        this.props.onSuccess(this.state.tasks.map(task => task.ossPreviewUrl));
      })
      .catch(error => {
        this.refresh();
        this.props.onError(error);
      });
  };

  refresh() {
    this.setState(this.state);
  }

  onProgress() {
    this.refresh();
  }

  removeTask() {}

  getPreviewImageUrl(fileName) {
    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(fileName);
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(fileName);
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(fileName);
    }
    return url;
  }

  render() {
    return (
      <div style={this.props.style}>
        <div
          style={this.props.uploadButtonStyle}
          className={styles.uploadButton}
          onClick={e => {
            e.preventDefault();
            this.uploader && this.uploader.click();
          }}
        >
          {this.props.uploadButton}
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          ref={reactElement => {
            this.uploader = reactElement;
          }}
          webkitdirectory
          multiple={this.props.multiple}
          accept={this.props.accept}
          onChange={e => {
            const files = [];
            for (var i = 0; i < e.target.files.length; i++) {
              files.push(e.target.files.item(i));
            }
            if (files.length <= 0) {
              return;
            }
            this.upload(files);
            // this.upload([{ name: "A.jpg" }, { name: "B.jpg" }]);
          }}
        />
        {isEmpty(this.state.tasks) === false && (
          <div
            className={styles.progressbarContainer}
            style={this.props.progressbarContainerStyle}
          >
            <div className={styles.progressbar}>
              {this.state.tasks.map((task, taskIndex) => {
                var progressbarProps = merge(
                  cloneDeep(this.props.progressbar.props),
                  {
                    progress: task.progress,
                    isError: task.isError,
                    isCompleted: task.isCompleted,
                    file: {
                      fileName: task.file.name,
                      preview: task.ossPreviewUrl
                    },
                    key: taskIndex
                  }
                );
                return React.cloneElement(
                  this.props.progressbar,
                  progressbarProps
                );
              })}
            </div>
            {this.props.removeButtonVisible && (
              <div>
                <div
                  className={styles.removeButton}
                  style={this.props.removeButtonStyle}
                  onClick={e => {
                    this.removeTask();
                  }}
                >
                  {this.props.removeButton}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  imagePolicy: state.oss.imagePolicy.toJS().data
});

const mapDispatchToProps = dispatch => {
  return {
    ossActions: bindActionCreators(ossActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Uploader);
