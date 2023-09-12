import { useGame } from "../GameContext"

export default function Bank () {
    const {bank} = useGame()
    return (
        <>
            <span>Start: {bank ? bank.start : 0}</span>
            <span>Reserve: {bank ? bank.reserve : 0}</span>
            <span>Remaining: {bank ? bank.total : 0}</span>
        </>
    )
}