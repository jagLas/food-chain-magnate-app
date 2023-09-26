const TotalRow = ({row}) => {

    return (
        <div className='table-row'>
            <div style={{fontWeight: 600}}>
                {row.name}
                <div style={{fontWeight: 400}} className="details">
                    <div>Revenue: {row.revenue}</div>
                    <div>Expenses: {-row.expenses}</div>
                    <div>Income: {row.income}</div>
                </div>
            </div>
            <div>{row.income}</div>
        </div>
    )
}

export default TotalRow