import { useEffect, useState } from "react"
import { authFetch } from "../utilities/auth";
import { Link, useNavigate } from "react-router-dom";
import { CardColor } from "../utilities/card-schemes";

function PlayerLink ({player, cardScheme}) {
    const navigate = useNavigate();

    return (
        <li>
            <Link className='card-format' to={`${player.id}`}
                style={{
                    "--card-color": cardScheme.background,
                    "--card-text-color": cardScheme.text
                }}
            >
                <div className='card-top'>
                    <h2>{player.name}</h2>
                </div>
                <div className='card-bottom'>Details</div>
            </Link>
        </li>
)
}

export default function ViewPlayers() {
    const navigate = useNavigate()

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                let data = await authFetch(`/players`);
                setPlayers(data)
            } catch(error) {
                navigate('/error', {state: { ...error }})
            }
        }

        fetchPlayers()
    }, [])

    

    return (
        <div className="view-players">
            <h2 className="menu-header">Players</h2>
            <ul className="card-list">
                {players.map((player, i) => {
                    return <PlayerLink
                                key={player.id}
                                player={player}
                                cardScheme={CardColor.getCardScheme(i)}
                            />
                })}
            </ul>
            <button className="menu-button" onClick={()=> navigate('create-player')}>Create a Player</button>
        </div>
    )
}