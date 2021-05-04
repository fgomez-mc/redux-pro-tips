import {albumsMock} from './albums.mock';
import Album from './components/Album/Album';

function App() {
  return (
    <div className="App">
      <h2>Albums</h2>
      <div>
        {albumsMock.map(({ id, title }) => (
          <Album key={id} title={title} id={id} />
        ))}
      </div>
    </div>
  );
}

export default App;
