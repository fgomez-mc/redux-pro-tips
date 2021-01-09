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
