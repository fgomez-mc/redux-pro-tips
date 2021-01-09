# Redux pro tips

**What is redux ?**

- Redux is a state management tool that outsource the distribution and flow the application’s data. 
- What I mean by control the flow is that redux allows you to set, get and update data that you collect through your apps different lifecycles. It also outsource the management of the data you choose too, as you can build your modules, actions and mutations as you need. 

![redux](https://miro.medium.com/proxy/1*EdiFUfbTNmk_IxFDNqokqg.png)

In the following lab we will focus on the we will focus on some concepts that can level up your redux setup:

- **Folder structure and naming convention.**
- **Redux dev tools**
- **Creating custom request generator**
- **Testing with redux**

### Getting started with the lab:

**1. Project setup**

- `git clone` and `yarn` into the [repo redux-pro-tips](git@github.com:fgomez-mc/redux-pro-tips.git)
- Install redux [dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

<sub>*Note: in addition to the `create-react-app` boilerplate, this project comes with some sample components and already installed packages `[react-test-renderer, react-redux, @reduxjs/toolkit]`*</sub>

**2. Create your first reducer**
- On the redux context, the term reducer is used for data modules. Redux gives you a set of utilities to customize and manage this modules. We will use the simpliest way to setup a reducer using the [createSlice](https://redux-toolkit.js.org/api/createSlice) function provided by the `@reduxjs/toolkit` package.

Thinking ahead as our application grows, we can plan what files we will use and how our store will be organized. Having a consisten folder naming and structure will help us scale as we add more application data modules.

```
store/
  albums/
   slice.js # reducer definition)
   selector.js # reducer data accessor
   thunks.js # async actions
  photos/
   slice.js
   selector.js
   thunks.js
  index.js #root reducer definition
```

We will start with the reducer definition for albums `src/store/albums/slice.js`

```javascript
import { createSlice } from "@reduxjs/toolkit";

export const albumsSlice = createSlice({
  name: "albums",
  initialState: {
    data: [],
  },
  reducers: {
    setAlbums: (state, action) => {
      state.data = action.payload.albums;
    },
  },
});

export const { setAlbums } = albumsSlice.actions;

export default albumsSlice.reducer;
```

**3. Configure the root reducer**

In order to allow our app to use multiple reducers we create a root reducer where we'll combine all our reducers using [combineReducers](https://redux.js.org/api/combinereducers) provided by `redux` and [configureStore](https://redux-toolkit.js.org/api/configureStore) provided by `@redux/toolkit`

Following our folder structure `store/index.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import albums from "./albums/slice";

const reducer = combineReducers({
  albums,
});

const store = configureStore({ reducer });

export default store;

```

**4. Integrate redux**

To integrate redux into our application, we use a wrapper provided by `react-redux` called [Provider](https://react-redux.js.org/api/provider). The `Provider` receives one `store` object as a prop and un child component where injects the props and makes them available for usable through the application components that invoke them either using hooks or the `connect` function.

Is also worth mentioning that you might want to configure the `Provider` according to what makes sense in your application. For demo porpuses we will fit it into the `src/index.js`

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

**5. Check our integration**

If we configured the provider correctly, we can check now the state of our redux integration by using the redux dev tools. The configuration comes out of the box using the configure store functions provided by `@redux/toolkit`. Click on the dev tools icon on the top right and you should be able to see the current state of `albums`.

**6. Creating** `thunks` **and** `selector`

In order to retrieve data from the api, we will use a middleware called `redux-thunk`. Fortunately for us, the configuration comes also out of the box with `@redux/toolkit`, so we can focus on creating our async actions.

`src/store/albums/thunks.js`

```javascript
import { setAlbums } from "./slice";
import axios from "axios";

export const getAlbums = () => async (dispatch) => {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/albums");
    dispatch(setAlbums({ albums: res.data }));
  } catch (e) {
    console.log(e);
  }
};
```
and our data accessor `src/store/albums/selector.js`

```javascript
export const albumsSelector = (state) => state.albums.data;
```

**7) Integrating the albums reducer into our app**

With all the pieces ready, we can update our applicaton loading to request the data on initial load using [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) to call the thunk function and access the data retrieved data using the our album [selector](https://react-redux.js.org/api/hooks#useselector).  

`src/App.js`


```javascript
import "./App.css";
import { useEffect } from "react";
import Album from "./components/Album/Album";
import { useDispatch, useSelector } from "react-redux";
import { getAlbums } from "./store/albums/thunks";
import { albumsSelector } from "./store/albums/selector";

function App() {
  const albums = useSelector(albumsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAlbums = async () => {
      dispatch(getAlbums());
    };
    fetchAlbums();
  }, [dispatch]);

  return (
    <div className="App">
      <h2>Albums</h2>
      <div>
        {albums.map(({ id, title }) => (
          <Album key={id} title={title} id={id} />
        ))}
      </div>
    </div>
  );
}

export default App;

```

**8. Updating our app test**

Setting up (spies)[https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname] on the `redux-redux` functions that we expect to access on our components makes easy to isolate our component without extensive mock configuration. 

```javascript
import renderer from "react-test-renderer";
import * as redux from "react-redux";
import App from "./App";

describe("App", () => {
  jest.spyOn(redux, "useDispatch");
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  const albums = Array(6)
    .fill(null)
    .map((_, i) => ({ id: i, title: `Album #${i}` }));

  test("renders learn react link", () => {
    useSelectorMock.mockReturnValueOnce(albums);
    const testRenderer = renderer.create(<App />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});

``