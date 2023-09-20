import Totals from './Totals';
import {  useGame } from './GameContext/GameContext';
import RoundView from './RoundView';
import BankReserveModal from './BankReserveModal';

export default function GameView() {
    const game = useGame()

    if(!game.isLoaded) {
        return <div>Failed to fetch</div>
    }
    return (
        <>
            <BankReserveModal />
            <Totals />
            <RoundView />
        </>
    )
}