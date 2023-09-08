import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

const GameContext = createContext(null);

const GameDispatchContext = createContext(null);

export function GameProvider({ children }) {
  const [game, dispatch] = useReducer(
    gameReducer,
    initialGameState
  );

  const {gameId} = useParams()

  useEffect(() => {
    const fetchRounds = async () => {
      try{
        let roundData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds`)

        roundData = await roundData.json()

        let salesData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/sales`)
    
        salesData = await salesData.json()

        let totalsData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/player_totals`)
    
        totalsData = await totalsData.json()

        console.log(roundData, salesData, totalsData)
      } catch(error) {
        console.log(error)
      }
    }
    
    fetchRounds()
  },[gameId])

  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}

const actions = {
    FETCH_ROUNDS: 'FETCH_ROUNDS',
    FETCH_SALES: 'FETCH_SALES',
    FETCH_TOTALS: 'FETCH_TOTALS'
}

function gameReducer(game, action) {
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_ROUNDS:
            return {
                ...game,
                rounds: ['test']
            }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialGameState = {
    rounds: [],
    sales: [],
    totals: []
};
