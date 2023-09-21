import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import gameReducer, {actions} from './GameReducer';
import { authFetch } from '../../../utilities/auth';

const GameContext = createContext(null);

const GameDispatchContext = createContext(null);

const initialGameState = {
    rounds: [],
    sales: [],
    totals: [],
    players: [],
    bank: {start: 0, reserve: 0, total: 0},
    isLoaded: false
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
                let roundData = await authFetch(`/games/${gameId}/rounds`)

                let salesData = await authFetch(`/games/${gameId}/sales`)

                let playersData = await authFetch(`/games/${gameId}/players`)

                let bankData = await authFetch(`/games/${gameId}/bank`)

                dispatch({type: actions.FETCH_DATA,
                    payload: {salesData, roundData, playersData, bankData}})
            } catch(error) {
                console.log(error)
            }
        }
        fetchRounds()
    }, [gameId])

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