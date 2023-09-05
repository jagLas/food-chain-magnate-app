import './App.css';
import Totals from './components/Totals';
import Rounds from './components/Rounds';
import CreateGameForm from './components/CreateGame/CreateGame';

function App() {
  return (
    <div className="App">
      <CreateGameForm />
      <Totals />
      <Rounds />
    </div>
  );
}

export default App;
