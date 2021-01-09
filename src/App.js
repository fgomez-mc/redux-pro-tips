import "./App.css";
import { useState, useEffect } from "react";
import Album from "./components/Album/Album";
import axios from "axios";

function App() {
  const [albums, setAlbums] = useState([]);
  const getAlbums = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/albums");
    setAlbums(res.data);
  };
  useEffect(() => {
    getAlbums();
  }, []);

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
