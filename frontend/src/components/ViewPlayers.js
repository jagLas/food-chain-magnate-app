import { useEffect, useState, useRef } from "react"
import { authFetch, useFetch } from "../utilities/auth";
import { useNavigate } from "react-router-dom";
import { CardColor } from "../utilities/card-schemes";
import Loading from "./Loading";

const warning = `This player has games associated with them and cannot be deleted
    until all this player's games have been removed.`

function PlayerLink ({player, cardScheme}) {
    const [isSelected, setIsSelected] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [nameField, setNameField ] = useState('');
    const navigate = useNavigate();
    const ref = useRef(null);

    const outsideClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsSelected(false);
            setConfirmDelete(false);
            setIsEdit(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', outsideClick, true)
        return () => {
            document.removeEventListener('click', outsideClick, true)
        }
    }, [])

    const onClickHandler = (e) => {
        setIsSelected(!isSelected)
    }

    const deleteClickHandler = async (event) => {
        event.stopPropagation()

        try {
            const data = await authFetch(`/players/${player.id}?confirm=${Boolean(confirmDelete)}`, {
                method: 'DELETE',
                body: JSON.stringify({delete: false})
            })
            console.log(data)
            setConfirmDelete(data)
            if (data.deleted) {
                setIsDeleted(true)
            }
        } catch (error) {
            navigate('/error', {state: { ...error }})
        }
    }

    const cancelDeleteClick = (e) => {
        e.stopPropagation()
        setConfirmDelete(false)
    }

    const changeNameClick = async (e) => {
        e.preventDefault()
        const payload = {
            name: nameField
        }

        const body = JSON.stringify(payload)

        try{
            const data = await authFetch(`/players/${player.id}`, {
                method: 'PATCH',
                body
            })
            console.log(data)
            navigate(0)
        } catch (error) {
            navigate('/error', {state: { ...error }})
        }
    }

    if (isDeleted) {
        return false
    }

    return (
        <li ref={ref}>
            <div className='card-format' onClick={onClickHandler}
                style={{
                    "--card-color": cardScheme.background,
                    "--card-text-color": cardScheme.text
                }}
            >
                <div className='card-top'>
                    <h2>{player.name}</h2>
                </div>
                <div className='card-bottom'></div>
            </div>
            {isSelected &&
            <div className='card-options' onClick={onClickHandler}>
                <h2>{player.name}</h2>
                <button 
                    className='menu-button small'
                    onClick={()=>navigate(`/players/${player.id}`)}
                >Stats</button>
                <button
                    className='menu-button small'
                    onClick={()=> setIsEdit(true)}
                >Edit</button>
                <button className='menu-button small' onClick={deleteClickHandler}>Delete</button>
            </div>
            }
            {isEdit &&
                <form className="card-options">
                    <label htmlFor="change-name"><h2>Change Name:</h2></label>
                    <input
                        id="change-name"
                        style={{border: '1px solid black'}}
                        type="text"
                        placeholder={player.name}
                        value={nameField}
                        onChange={(e) => setNameField(e.target.value)}
                    />
                    <button
                    className="menu-button small"
                        onClick={changeNameClick}
                    >Confirm</button>
                    <button
                        className="menu-button small"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEdit(false);
                            setIsSelected(true);
                        }}
                    >Cancel</button>
                </form>

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
                {confirmDelete.ready ? 
                    <button className='menu-button small' onClick={deleteClickHandler}>Yes</button> : false
                }
                <button className='menu-button small' onClick={cancelDeleteClick}>Cancel</button>
            </div>
            }
        </li>
)
}

export default function ViewPlayers() {
    const navigate = useNavigate()
    const [players, isLoading] = useFetch('/players');

    return (
        <div id="view-players">
            <h2 className="menu-header">Players</h2>
            {isLoading ? <Loading /> :
            <ul className="card-list">
                {players.length ?
                    players.map((player, i) => {
                        return <PlayerLink
                                    key={player.id}
                                    player={player}
                                    cardScheme={CardColor.getCardScheme(i)}
                                />
                    })
                :
                    <h3>You do not currently have any players!</h3>
                }
            </ul>}
            <button className="menu-button" onClick={()=> navigate('create-player')}>Create a Player</button>
            <button className="menu-button" onClick={()=> navigate('/games/create-game')}>Create a Game</button>
        </div>
    )
}