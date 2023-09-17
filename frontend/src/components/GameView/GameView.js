import Totals from './Totals';
import { GameProvider } from './GameContext/GameContext';
import RoundView from './RoundView';
import Bank from './Bank';

export default function GameView() {

    return (
        <GameProvider>
            <Totals />
            <RoundView />
        </GameProvider>
    )
}