
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
import { createContext, useContext, useState } from 'react';
import { checkAuth } from './utilities/auth';
import ViewPlayers from './components/ViewPlayers';
import InConstruction from './components/InConstruction';

const UserContext = createContext(null)

export function useUserContext() {
  return useContext(UserContext)
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth() || false)

  return (
    <div className="App">
      {/* provider for authentication boolean */}
      <UserContext.Provider value={{isAuthenticated, setIsAuthenticated}}>  
        <SiteHeader/>
        <Routes>
          <Route path='/' element={<LandingPage />}></Route>

          <Route path='games'>
            <Route path='' element={<LoadGames />}></Route>
            <Route path='create-game' element={<CreateGameForm />}></Route>
            <Route path=':gameId'>
              <Route path='stats' element={<InConstruction/>}></Route>
              <Route path='rounds/:roundNum' element={<GameProvider children={<GameView />}/>}></Route>
            </Route>
          </Route>

          <Route path='players'>
            <Route path='' element={<ViewPlayers />}></Route>
            <Route path='create-player' element={<CreatePlayer />}></Route>
            <Route path=':playerId' element={<InConstruction />}></Route>
          </Route>

          <Route path='/error' element={<ErrorPage/>}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
