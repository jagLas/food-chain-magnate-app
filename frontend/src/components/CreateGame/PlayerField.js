const PlayerField = ({playerList, player, setPlayer, playerNum}) => {

    return (
        <>
            <label>{'Player ' + parseInt(playerNum + 1)}
                <select value={player} onChange={(event) => {setPlayer(event.target.value)}}>
                    <option value={null}></option>
                    {playerList.map((player) => {
                        return <option key={player.id} value={player.id}>{player.name}</option>
                    })}
                </select>
            </label>
        </>
    )
}

export default PlayerField