import Totals from './Totals/Totals';
import {  useGame } from './GameContext/GameContext';
import RoundView from './RoundView/RoundView';
import BankReserveModal from './BankReserveModal';

export default function GameView() {
    const game = useGame()

    if(!game.isLoaded) {
        return <h2>Your Data - Coming Soon</h2>
    }
    return (
        <>
            <BankReserveModal />
            <Totals />
            <RoundView />
        </>
    )
}