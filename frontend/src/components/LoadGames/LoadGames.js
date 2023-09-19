import {useEffect, useMemo, useState} from 'react'
import LoadGameLink from './LoadGameLink'
import { CardColor } from '../card-schemes'

const LoadGames = () => {
    const [games, setGames] = useState([])

    const fetchGames = async () => {
        try{
            let data = await fetch(`${process.env.REACT_APP_DB_URL}/games`)
            data = await data.json()
            setGames(data)
        } catch(error){
            console.log(error)
        }

    }

    useEffect(() => {
        fetchGames()
    }, [])

    const rows = useMemo(()=> {
        const rows = []
    
        for (const [key, game] of Object.entries(games)) {
            rows.push(
                <LoadGameLink key={game.id} cardScheme={CardColor.getCardScheme(key)} game={game} />
            )
        }
        return rows
    }, [games])

    return (
        <>
            <ul className='card-list'>
                {rows}
            </ul>
        </>
    )
}

export default LoadGames