import { NavLink, useNavigate, useParams } from "react-router-dom"
import Rounds from "./Rounds"
import SalesView from "./SalesView"
import { useMemo } from "react"
import { useGame, useGameDispatch } from "../GameContext"
import { actions } from "../GameReducer"

export default function RoundView () {
    const {rounds, players} = useGame()
    const {gameId} = useParams()
    const dispatch = useGameDispatch()
    const navigate = useNavigate()


    const roundList = useMemo(() => {
        const numRounds = rounds.length / players.length
        const roundsArray = []
        roundsArray.push(<NavLink key={0} to={`rounds/all`}>All</NavLink>)
        for (let i = 0; i < numRounds; i++) {
            const navLink = <NavLink key={i + 1} to={`rounds/${i + 1}`}>{i+1}</NavLink>
            roundsArray.push(navLink)
        }
        return roundsArray
    }, [rounds.length, players.length])


    const formHandler = async (event) => {
        event.preventDefault()

        try {
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/rounds`, {
                method: 'POST'
            })
    
            data = await data.json()
    
            // debugger
            dispatch({
                type: actions.ADD_ROUNDS,
                payload: data
            })
    
            navigate(`rounds/${data[0].round}`)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2>Round Summary</h2>
            {roundList}
            <button onClick={formHandler}>New Round</button>
            <Rounds />
            <SalesView/>
        </div>
    )
}