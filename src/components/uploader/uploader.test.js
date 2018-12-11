import { shallow, mount } from "enzyme";
import { fn } from "moment";
import React from "react";
import { Uploader } from "./uploader";
import styles from "./uploader.module.css";

describe("上传组件测试", () => {
  test("单选", () => {
    const mockProps = {
      multiple: false,
      serviceUrl: "http://localhost:4000/upload"
    };
    const component = mount(<Uploader {...mockProps} />);
    var fileSelector = component.find('[type="file"]').getDOMNode();
    expect(fileSelector.multiple).toBeFalsy();
  });

  test("accept自定义成功", () => {
    const mockProps = {
      accept: "image/*",
      serviceUrl: "http://localhost:4000/upload"
    };
    const component = mount(<Uploader {...mockProps} />);
    var fileSelector = component.find('[type="file"]').getDOMNode();
    expect(fileSelector.accept).toBe("image/*");
  });
  // 文件上传不MockFunction不能被调用。不知为何
  // test("文件上传", () => {
  //   const mockProps = {
  //     serviceUrl: "http://localhost:4000/upload",
  //     onError: jest.fn()
  //   };
  //   const component = mount(<Uploader {...mockProps} />);
  //   component.instance().upload([{ name: "A.jpg" }, { name: "B.jpg" }]);
  //   // expect(component.state().tasks.length).toBe(2);
  //   expect(mockProps.onError).toBeCalled();
  //   console.log(mockProps.onError);
  // });

  // describe("progress测试",()=>{
  //   test("")
  // })
});
