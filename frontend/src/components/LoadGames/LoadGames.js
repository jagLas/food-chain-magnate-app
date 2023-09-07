import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import LoadGameLink from './LoadGameRow'

const LoadGames = () => {
    const [games, setGames] = useState([])
    // console.log(games)

    const fetchGames = async () => {
        try{
            let data = await fetch('http://host.docker.internal:5000/games')
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

    console.log(rows)

    return (
        <>
            <ul>
                {rows}
            </ul>
        </>
    )
}

export default LoadGames