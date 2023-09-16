const TotalRow = ({obj}) => {

    return (
        <div className={(obj.player_id ? 'player-row' : 'total-row') + ' table-row'}>
            <div>{obj.name ? obj.name : 'Total'}</div>
            <div>{obj.revenue}</div>
            <div>{-obj.expenses}</div>
            <div>{obj.income}</div>
        </div>
    )
}

export default TotalRow