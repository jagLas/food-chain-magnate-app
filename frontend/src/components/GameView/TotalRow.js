const TotalRow = ({obj}) => {
    return (
        <tr className={obj.player_id ? 'player-row' : 'total-row'}>
            <td>{obj.name ? obj.name : 'Total'}</td>
            <td>{obj.revenue}</td>
            <td>{obj.expenses}</td>
            <td>{obj.income}</td>
        </tr>
    )
}

export default TotalRow