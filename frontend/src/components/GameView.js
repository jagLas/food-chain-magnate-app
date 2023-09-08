import Totals from './GameView/Totals';
import Rounds from './GameView/Rounds';
import SalesView from './GameView/SalesView';
import { GameProvider } from './GameContext';
import RoundView from './GameView/RoundView';

export default function GameView() {

    return (
        <GameProvider>
            <Totals />
            <RoundView />
        </GameProvider>
    )
    
    

}