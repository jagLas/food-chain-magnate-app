import { useState, useEffect } from "react"
import TotalRow from "./TotalRow"

const Totals = () => {
    const [incomeSummary, setIncomeSummary] = useState({})

    let getData = async () => {
      let data = await fetch('http://host.docker.internal:5000/games/1/player_totals')
  
      data = await data.json()
      setIncomeSummary(data)
    }
  
    useEffect(()=>{
      getData()
    },[])

    const rows = [];

    for (const [key, value] of Object.entries(incomeSummary)) {
        rows.push(<TotalRow obj={value} key={key} />)
    }

    return (
        <table id='total-summary'>
          <tr className="table-header">
            <th>Player Id</th>
            <th>Total Revenue</th>
            <th>Total Expenses</th>
            <th>Total Income</th>
          </tr>
          {rows}
        </table>
    )
}

export default Totals