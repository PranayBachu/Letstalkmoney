import React from "react";
import renderer from "react-test-renderer";

import { LoadingScreen } from "./screens/LoadingScreen";

describe("<LoadingScreen />", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<LoadingScreen />).toJSON();
    expect(tree.children.length).toBe(2);
    // console.log("the length is: ", tree.children.length);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<LoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
