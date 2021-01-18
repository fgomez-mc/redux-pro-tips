# Redux pro tips

**What is redux ?**

- Redux is a state management library that outsources the distribution and flow of the application’s data.

![redux](https://miro.medium.com/proxy/1*EdiFUfbTNmk_IxFDNqokqg.png)

- Redux allows you to have a single data source to store and use as you need through the application.

![with redux](https://blog.codecentric.de/files/2017/12/Bildschirmfoto-2017-12-01-um-08.53.32.png)

In the following lab, we will focus on some concepts that can level up your redux integrations:

- **Folder structure and naming convention.**
- **Redux dev tools**
- **Testing with redux**
- **Additional tips**

### Getting started with the lab:

**1. Project setup**

- `git clone` and `yarn` into the [repo redux-pro-tips](git@github.com:fgomez-mc/redux-pro-tips.git)
- Install redux [dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

<sub>_Note: in addition to the `create-react-app` boilerplate, this project comes with some sample components and already installed packages `react-test-renderer, react-redux, @reduxjs/toolkit`<sup>[Nov 12, 2019](https://github.com/reduxjs/redux-toolkit/releases/tag/v1.0.4)</sup>_</sub>

**2. Create your first reducer**

- In the redux context, the term reducer is a naming convention used for data modules. Redux gives you a set of rules to customize and manage these data modules. To create a data module or a slice of what is going to be the application state, we will use a utility called[createSlice](https://redux-toolkit.js.org/api/createSlice) provided by the `@reduxjs/toolkit` package.

Thinking ahead as our application grows, we can start planning how our folder structure will look like and which files should be in them. Having a consistent folder naming and structure will help us scale as we add more modules to the app.

![redux data flow](https://res.cloudinary.com/practicaldev/image/fetch/s--m5BdPzhS--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://i.imgur.com/riadAin.gif)

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

To allow our app to use multiple reducers we create a root reducer where we'll combine all our reducers using [combineReducers](https://redux.js.org/api/combinereducers) provided by `redux` and [configureStore](https://redux-toolkit.js.org/api/configureStore) provided by `@redux/toolkit`

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

To integrate redux into our application, we use a wrapper provided by `react-redux` called [Provider](https://react-redux.js.org/api/provider). The `Provider` receives one `store` object as a prop and one child component where injects the props and makes them available for use through the application.

Is also worth mentioning that you might want to configure the `Provider` according to what your application needs. For demo porpuses we will fit it into the `src/index.js`

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

If we configured the provider correctly, we can check now the state of our redux integration by using the redux dev tools. The configuration comes out of the box using the configure store functions provided by `@redux/toolkit`. Click on the dev tools icon on the top right and you should be able to see the current state of `albums`. If the icon is not available, right click and inspect the page.

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

With all the pieces ready, we can update our application initial mount to call the api and request the data using [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) combined with our thunk function `getAlbums`. Once the data has been set, we should have it available using a [selector](https://react-redux.js.org/api/hooks#useselector).

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

Setting up [spies](https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname) on the react-redux functions that we expect to call inside our components makes it easy to isolate our logic without extensive mock configuration.

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
```

**Other configuration:**

As the application continues to grow and we continue to add more code into it, we will notice that some actions or outcomes are repeated and we want to keep our code as DRY as possible. Some useful strategies that we can combine to reach our goal could be:

- **Custom request generator:** creating a function that receives the parameters that will repeat on each request such as api endpoints, error handler or even adding authentication to our requests.
- **Axios custom instance:** we can create our custom axios and add some default configutation to simplify request handling. [Read more](https://github.com/axios/axios#creating-an-instance)
- **Redux middlewares:** you can extend the redux configuration and automate tasks that will run on each action call with middlewares. [About middlewares](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware), [About Configure store](https://redux-toolkit.js.org/api/configureStore#middleware)
- **Persist state:** redux persist allows you to keep your application data through refresh. You can choose the type of storage to use to persist your data such as local storage. [Read more](https://github.com/rt2zz/redux-persist)
