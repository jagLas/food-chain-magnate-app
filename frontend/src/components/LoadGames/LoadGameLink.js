import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch } from '../../utilities/auth';

const warning = `This game either has sales data or has multiple rounds.
    Deleting this game would delete all associated data. This cannot be undone.
`

const LoadGameLink = ({game, cardScheme}) => {
    const [isSelected, setIsSelected] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const navigate = useNavigate();

    const onClickHandler = (e) => {
        setIsSelected(!isSelected)
    }

    const deleteClickHandler = async (event) => {
        event.stopPropagation()

        try {
            const data = await authFetch(`/games/${game.id}?confirm=${Boolean(confirmDelete)}`, {
                method: 'DELETE',
                body: JSON.stringify({delete: false})
            })
            setConfirmDelete(data)
            if (data.deleted) {
                setIsDeleted(true)
            }
        } catch (error) {
            navigate('/error', {state: { ...error }})
        }
    }

    const cancelOnClick = (e) => {
        e.stopPropagation()

        setConfirmDelete(false)
    }

    if (isDeleted) {
        return false
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
                    <button 
                        className='menu-button small'
                        onClick={()=>navigate(`${game.id}/rounds/all`)}
                    >Load</button>
                    <button
                        className='menu-button small'
                        onClick={()=>navigate(`${game.id}/stats`)}
                    >Stats</button>
                    <button className='menu-button small' onClick={deleteClickHandler}>Delete</button>
                </div>
                }
                {confirmDelete &&
                <div className='card-options confirm-delete'>
                    <p>Are you sure you wish to continue?</p>
                    <p style={{
                        color: confirmDelete.ready ? 'green': 'red',
                        fontSize: '12px', padding: '8px'
                        }}>
                        {confirmDelete.ready ? 'Ready to Delete' : warning}
                    </p>
                    <button className='menu-button small' onClick={deleteClickHandler}>Yes</button>
                    <button className='menu-button small' onClick={cancelOnClick}>Cancel</button>
                </div>
                }
            </li>
    )
}

export default LoadGameLink