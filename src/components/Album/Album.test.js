import renderer from "react-test-renderer";
import Album from "./Album";

describe("album", () => {
  it("match the snapshot", () => {
    const testRenderer = renderer.create(<Album />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
