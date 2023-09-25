import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const LoadGameLink = ({game, cardScheme}) => {
    const [isSelected, setIsSelected] = useState(false);
    const navigate = useNavigate();

    const onClickHandler = () => {
        setIsSelected(!isSelected)
    }

    return (
            <li>
                <div className='card-format' onClick={onClickHandler}
                    style={{
                        "--card-color": cardScheme.background,
                        "--card-text-color": cardScheme.text
                    }}
                >
                    <div className='card-top'>
                        <h2>ID</h2>
                        <div>{game.id}</div>
                    </div>
                    <div className='card-bottom'>Players: {game.players.length}</div>
                </div>
                {isSelected &&
                <div className='card-options' onClick={onClickHandler}>
                    <h2>{game.id}</h2>
                    <button on className='menu-button small' onClick={()=>navigate(`${game.id}/rounds/all`)}>Load</button>
                    <button className='menu-button small'>Delete</button>
                    <button className='menu-button small'>Stats</button>
                </div>
                }
            </li>
    )
}

export default LoadGameLink