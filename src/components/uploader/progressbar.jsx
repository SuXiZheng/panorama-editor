import React from "react";
import styles from "./progressbar.module.css";

export class Progressbar extends React.PureComponent {
  render() {
    return (
      <div className={styles.container} key={this.props.key}>
        <div
          className={styles.fileName}
          style={{ color: this.props.isError ? "red" : "black" }}
        >
          <span>{this.props.file.fileName}</span>
        </div>
        <div className={styles.progressbarContainer}>
          <div
            className={styles.progress}
            style={{ width: `${this.props.progress}%` }}
          />
        </div>
      </div>
    );
  }
}
