import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const LoadGameLink = ({key, game}) => {
    return (
        <>
            <li key={key}>
                <span>
                    <Link to={`${game.id}`}>Id: {game.id} <span>Players: </span>
                    <span>{game.players.length}</span></Link>
                </span>  
            </li>
        </>
    )
}

export default LoadGameLink