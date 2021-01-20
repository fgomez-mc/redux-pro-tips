import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import albums from "./albums/slice";

const reducer = combineReducers({
  albums,
});

const store = configureStore({ reducer });

export default store;
