import Totals from './Totals';
import { GameProvider } from './GameContext/GameContext';
import RoundView from './RoundView';
import Bank from './Bank';
import BankReserveModal from './BankReserveModal';

export default function GameView() {

    return (
        <GameProvider>
            <BankReserveModal />
            <Totals />
            <RoundView />
        </GameProvider>
    )
}