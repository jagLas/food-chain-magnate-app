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

        dispatch({type: actions.FETCH_DATA, payload: {salesData, roundData, totalsData}})
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

export const actions = {
    FETCH_DATA: 'FETCH_DATA'
}

function gameReducer(game, action) {
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_DATA:
            return {
                rounds: payload.roundData,
                sales: payload.salesData,
                totals: payload.totalsData
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
