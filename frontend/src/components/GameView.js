import Totals from './GameView/Totals';
import Rounds from './GameView/Rounds';
import SalesView from './GameView/SalesView';
import { GameProvider } from './GameContext';

export default function GameView() {

    return (
        <GameProvider>
            <Totals />
            <Rounds />
            <SalesView/>
        </GameProvider>
    )
    
    

}