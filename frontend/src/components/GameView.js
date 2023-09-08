import Totals from './GameView/Totals';
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