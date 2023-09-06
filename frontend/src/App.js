import './App.css';
import Totals from './components/Totals';
import Rounds from './components/Rounds';
import CreateGameForm from './components/CreateGame/CreateGame';
import {Link, Route, Routes} from 'react-router-dom'
import LandingPage from './components/LandingPage';

function App() {
  return (

    <div className="App">
      <h1>Food Chain Companion App</h1>
      <Routes>
        <Route path='/create-game' element={<CreateGameForm />}></Route>
        <Route path='/games/:id' element={<><Totals /><Rounds /></>}></Route>
        <Route path='/' element={<LandingPage />}></Route>
      </Routes>
    </div>

  );
}

export default App;
