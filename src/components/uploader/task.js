/**
 * 上传任务
 *
 * @export
 * @class UploadTask
 */
export class UploadTask {
  constructor(file) {
    this._file = file;
    this._isCanceled = false;
    this._isCompleted = false;
    this._isError = false;
    this._progress = 0;
  }

  get file() {
    return this._file;
  }

  /**
   *任务
   *
   * @readonly
   * @memberof Task
   */
  get task() {
    return this._task;
  }

  get progress() {
    return this._progress;
  }

  /**
   * 是否完成
   *
   * @readonly
   * @memberof Task
   * @returns bool
   */
  get isCompleted() {
    return this._isCompleted;
  }

  /**
   * 是否异常
   *
   * @readonly
   * @memberof Task
   */
  get isError() {
    return this._isError;
  }

  /**
   * 是否取消
   *
   * @readonly
   * @memberof Task
   */
  get isCanceled() {
    return this._isCanceled;
  }

  /**
   * 完成事件
   *
   * @memberof Task
   */
  set onCompleted(onCompleted) {
    this._onCompleted = onCompleted;
  }

  /**
   *错误事件
   *
   * @memberof Task
   */
  set onError(onError) {
    this._this.onError = onError;
  }

  /**
   *取消事件
   *
   * @memberof Task
   */
  set onCanceled(onCanceled) {
    this._onCanceled = onCanceled;
  }

  /**
   * 上传进度事件
   *
   * @memberof UploadTask
   */
  set onProgress(onProgress) {
    this._onProgress = onProgress;
  }

  /**
   * 执行上传
   *
   * @param {string} [serviceUrl] 服务器地址
   * @returns
   * @memberof UploadTask
   */
  execAsync(serviceUrl) {
    var formData = new FormData();
    formData.append("file", this._file);
    var instance = this;
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      // 加入这句，服务端跨域策略就不能返回“*”了。
      // xhr.withCredentials = true;
      xhr.open("post", serviceUrl, true);
      // xhr.setRequestHeader("Content-Type", "multipart/form-data");
      // xhr.setRequestHeader("cache-control", "no-cache");
      // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      // xhr.setRequestHeader(
      //   "Postman-Token",
      //   "45394f4a-f579-4f17-af6d-bd33eaa57850"
      // );
      xhr.upload.onprogress = e => {
        console.log(
          `${e.loaded} /  ${e.total}: ${Math.floor(
            (e.loaded / e.total) * 100
          )}%`
        );
        var precent = e.total <= 0 ? 0 : Math.floor((e.loaded / e.total) * 100);
        instance._progress = precent;
        instance._onProgress({
          oaded: e.loaded,
          total: e.total,
          precent
        });
      };
      xhr.upload.onerror = e => {
        instance._isError = true;
        reject(e);
      };
      xhr.upload.onloadstart = e => {};
      // xhr.onerror = e => {
      //   instance._isError = true;
      //   reject(e);
      // };
      xhr.onload = e => {
        instance._isCompleted = true;
        resolve(e);
      };
      xhr.send(formData);
    });
  }
}
