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
