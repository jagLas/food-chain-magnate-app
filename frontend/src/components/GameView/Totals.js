import { useState, useEffect } from "react"
import TotalRow from "./TotalRow"
import { useParams } from "react-router-dom"
import { useGame } from "../GameContext"

const Totals = () => {

    const incomeSummary = useGame().totals;
  
    const rows = [];
    for (const [key, value] of Object.entries(incomeSummary)) {
        rows.push(<TotalRow obj={value} key={key} />)
    }

    return (
      <>
        <h2>Game Summary</h2>
        <table id='total-summary'>
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Income</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </>

    )
}

export default Totals