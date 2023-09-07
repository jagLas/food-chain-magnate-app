import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const LoadGameLink = ({game}) => {
    return (
            <li>
                <span>
                    <Link to={`${game.id}`}>Id: {game.id} <span>Players: </span>
                    <span>{game.players.length}</span></Link>
                </span>  
            </li>
    )
}

export default LoadGameLink