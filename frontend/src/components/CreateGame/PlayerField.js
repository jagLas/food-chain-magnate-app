import { useEffect, useState } from "react"


const PlayerField = ({playerList, player, setPlayer, playerNum, selectedPlayers, cardScheme}) => {
    // creates a filtered player list to use for options in select
    const [filteredPlayers, setFilteredPlayers] = useState(playerList.slice())

    // filters the playerList to only those that aren't being used in other fields
    useEffect(() => {
        let array = playerList.slice()
        array = array.filter(player => {
            // add to filtered array if it is not in the selected players list
            return !selectedPlayers.includes(player.id.toString())
        })
        setFilteredPlayers(array)
    }, [playerList, selectedPlayers])

    return (
        <li className="card-format" style={{
            "--card-color": cardScheme.background,
            "--card-text-color": cardScheme.text
        }}>
            <label className="card-top">
                <h2>{'Player ' + parseInt(playerNum + 1)}</h2>
            </label>
            <div className="card-bottom">
                <select value={player} onChange={(event) => {setPlayer(event.target.value)}}>
                        <option value={null}></option>
                        {filteredPlayers.map((player) => {
                            return <option
                                        key={player.id}
                                        value={player.id}
                                    >{player.name}</option>
                        })}
                </select>
            </div>

        </li>
    )
}

export default PlayerField