import Totals from './Totals/Totals';
import {  useGame } from './GameContext/GameContext';
import RoundView from './RoundView/RoundView';
import BankReserveModal from './BankReserveModal';
import Loading from '../Loading';

export default function GameView() {
    const game = useGame()

    if(!game.isLoaded) {
        return <Loading />
    }
    return (
        <>
            <BankReserveModal />
            <Totals />
            <RoundView />
        </>
    )
}