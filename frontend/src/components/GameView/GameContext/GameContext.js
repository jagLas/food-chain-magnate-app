import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import gameReducer, {actions} from './GameReducer';
import { useFetch } from '../../../utilities/auth';

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
    const [gameData, isLoading] = useFetch(`/games/${gameId}`)

    useEffect(() => {
        if(!isLoading) {
            console.log('dispatching', gameData)
            dispatch({type: actions.FETCH_DATA,
                payload: {
                    salesData: gameData.sales,
                    roundData: gameData.rounds,
                    playersData: gameData.players,
                    bankData: gameData.bank}})
        }
    }, [gameData, isLoading])

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