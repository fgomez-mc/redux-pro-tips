import { render } from "react-dom";
import renderer from "react-test-renderer";
import App from "./App";

describe("App", () => {
  test("renders learn react link", () => {
    const testRenderer = renderer.create(<App />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
