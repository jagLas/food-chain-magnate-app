
import './App.css';

import GameView from './components/GameView/GameView';
import CreateGameForm from './components/CreateGame/CreateGame';
import {Route, Routes} from 'react-router-dom'
import LandingPage from './components/LandingPage';
import LoadGames from './components/LoadGames/LoadGames';
import CreatePlayer from './components/CreatePlayer';
import SiteHeader from './components/SiteHeader';
import { GameProvider } from './components/GameView/GameContext/GameContext';
import ErrorPage from './components/ErrorPage';

function App() {
  return (

    <div className="App">
      <SiteHeader/>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='games'>
          <Route path='' element={<LoadGames />}></Route>
          <Route path='create-game' element={<CreateGameForm />}></Route>
          <Route path=':gameId' element={<GameProvider children={<GameView />}/>}>
            <Route path='rounds/:roundNum' element={<></>}></Route>
          </Route>
        </Route>
        <Route path='players'>
          <Route path='create-player' element={<CreatePlayer />}></Route>
        </Route>
        <Route path='/error' element={<ErrorPage/>}></Route>
      </Routes>
    </div>

  );
}

export default App;
