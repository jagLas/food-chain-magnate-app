import { NavLink, useParams } from "react-router-dom"
import Rounds from "./Rounds"
import SalesView from "./SalesView"
import { useMemo } from "react"
import { useGame } from "../GameContext"

export default function RoundView () {
    const {rounds, players} = useGame()

    const roundList = useMemo(() => {
        const numRounds = rounds.length / players.length
        const roundsArray = []
        for (let i = 0; i < numRounds; i++) {
            const navLink = <NavLink key={i} to={`rounds/${i + 1}`}>{i+1}</NavLink>
            roundsArray.push(navLink)
        }
        return roundsArray
    })

    return (
        <div>
            <h2>Round Summary</h2>
            {roundList}
            <Rounds />
            <SalesView/>
        </div>
    )
}