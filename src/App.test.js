import renderer from "react-test-renderer";
import * as redux from "react-redux";
import App from "./App";

describe("App", () => {
  jest.spyOn(redux, "useDispatch");
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  const albums = Array(6)
    .fill(null)
    .map((_, i) => ({ id: i, title: `Album #${i}` }));

  test("renders learn react link", async () => {
    useSelectorMock.mockReturnValueOnce(albums);
    const testRenderer = await renderer.create(<App />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
