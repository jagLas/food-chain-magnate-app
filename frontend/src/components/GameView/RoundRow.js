const RoundRow = ({round}) => {
    return (
        <>
            <tr>
                <td>{round.player_name}</td>
                <td>{round.cfo ? 'X' : ''}</td>
                <td>{round.first_burger ? 'X' : ''}</td>
                <td>{round.first_pizza ? 'X' : ''}</td>
                <td>{round.first_drink ? 'X' : ''}</td>
                <td>{round.first_waitress ? 'X' : ''}</td>
                <td>{round.unit_price}</td>
                <td>{round.waitresses}</td>
                <td>{round.salaries_paid}</td>
            </tr>
        </>

    )
}

export default RoundRow