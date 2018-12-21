import React from "react";
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

const styles = theme => ({
  card: {
    maxWidth: 345,
    marginTop: 10,
    minHeight: 220,
    position: "relative"
  },
  media: {
    height: 140
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

class UploadProgressbar extends React.PureComponent {
  render() {
    console.log(this.props.file.preview);
    const { classes, file } = this.props;
    return (
      <Card className={classes.card} raised={true}>
        <div className={classes.progressContainer}>
          {this.props.isCompleted === false && (
            <CircularProgress
              size={70}
              className={classes.progress}
              variant="determinate"
              value={this.props.progress}
            />
          )}
        </div>
        {this.props.isCompleted && (
          <CardMedia
            image={this.props.file.preview}
            title={this.props.file.fileName}
            className={classes.media}
          />
        )}

        {/* <CardContent>
          <FormControlLabel
            control={
              <Radio
                value={file.fileName}
                // checked={isEqual(scene.index, this.state.currentSceneIndex)}
              />
            }
            label={
              <TextField
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                defaultValue={file.fileName}
                placeholder="请输入场景标题"
                required={true}
              />
            }
          />
        </CardContent> */}
      </Card>
    );
  }
}

export default withStyles(styles)(UploadProgressbar);
