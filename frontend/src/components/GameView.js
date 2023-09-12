import Totals from './GameView/Totals';
import { GameProvider } from './GameContext';
import RoundView from './GameView/RoundView';
import Bank from './GameView/Bank';

export default function GameView() {

    return (
        <GameProvider>
            <Totals />
            <Bank />
            <RoundView />
        </GameProvider>
    )
    
    

}