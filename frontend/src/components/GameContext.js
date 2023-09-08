import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import gameReducer, {actions} from './GameReducer';

const GameContext = createContext(null);

const GameDispatchContext = createContext(null);

const initialGameState = {
    rounds: [],
    sales: [],
    totals: [],
    players: [],
};

export function GameProvider({ children }) {
    const [game, dispatch] = useReducer(
        gameReducer,
        initialGameState
    );

    const {gameId} = useParams()

    // fetches game data from api service and dispatches to the game state
    useEffect(() => {
        const fetchRounds = async () => {
            try{
                let roundData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds`)
                roundData = await roundData.json()

                let salesData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/sales`)
                salesData = await salesData.json()

                let totalsData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/player_totals`)
                totalsData = await totalsData.json()

                let playersData = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/players`)
                playersData = await playersData.json()

                dispatch({type: actions.FETCH_DATA,
                    payload: {salesData, roundData, totalsData, playersData}})
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