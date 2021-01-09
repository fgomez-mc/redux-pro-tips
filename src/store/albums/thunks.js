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
