import {useEffect, useState} from 'react'
import LoadGameLink from './LoadGameRow'

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
    },[])

    const rows = []

    for (const [key, value] of Object.entries(games)) {
        rows.push(
            <LoadGameLink key={key} game={value} />
        )
    }

    return (
        <>
            <ul>
                {rows}
            </ul>
        </>
    )
}

export default LoadGames