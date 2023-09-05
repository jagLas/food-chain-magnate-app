const TotalRow = ({obj}) => {
    return (
        <tr className={obj.player_id ? 'player-row' : 'total-row'}>
            <td>{obj.name ? obj.name : 'total'}</td>
            <td>{obj.total_revenue}</td>
            <td>{obj.total_expenses}</td>
            <td>{obj.total_income}</td>
        </tr>
    )
}

export default TotalRow