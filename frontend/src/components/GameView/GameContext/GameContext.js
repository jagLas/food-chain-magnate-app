import { createContext, useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const navigate = useNavigate()

    const [game, dispatch] = useReducer(
        gameReducer,
        initialGameState
    );

    const {gameId} = useParams()

    // fetches game data from api service and dispatches to the game state
    useEffect(() => {
        const fetchRounds = async () => {
            try{
                let gameData = await authFetch(`/games/${gameId}`)

                dispatch({type: actions.FETCH_DATA,
                    payload: {
                        salesData: gameData.sales,
                        roundData: gameData.rounds,
                        playersData: gameData.players,
                        bankData: gameData.bank}})
            } catch(error) {
                navigate('/error', {state: { ...error }})
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