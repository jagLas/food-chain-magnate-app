import TotalRow from "./TotalRow"
import { useGame } from "../GameContext"
import { useMemo } from "react";

const Totals = () => {
    const {players, rounds} = useGame()

    const totalRows = useMemo(() => {
      const totals = {
        total: {
          name: 'total',
          income: 0,
          revenue: 0,
          expenses: 0
        }
      }
      for (const player of players){
        totals[player.id] = {
          name: player.name,
          revenue: 0,
          expenses: 0,
          income: 0
        }
      }
      rounds.reduce((accumulator, currentValue) => {
        accumulator[currentValue.player_id].income += currentValue.round_income;
        accumulator[currentValue.player_id].expenses += currentValue.salaries_expense;
        accumulator[currentValue.player_id].revenue += currentValue.round_total;
        accumulator.total.income += currentValue.round_income;
        accumulator.total.expenses += currentValue.salaries_expense;
        accumulator.total.revenue += currentValue.round_total;
        return accumulator;
      }, totals)

      let totalsArray = []
      for (const key in totals) {
        totalsArray.push(totals[key])
      }
      totalsArray.sort((a,b) => {
        if (a.name === 'total') {
          return 1
        }

        if (b.name === 'total') {
          return -1
        }

        return a.name > b.name
      })

      const rows = []
      for (const [key, value] of Object.entries(totalsArray)) {
        rows.push(<TotalRow obj={value} key={key} />)
      }
      return rows
    }, [rounds, players])

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
          <tbody>{totalRows}</tbody>
        </table>
      </>

    )
}

export default Totals