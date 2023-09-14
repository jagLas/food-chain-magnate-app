import TotalRow from "./TotalRow"
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { useEffect, useMemo } from "react";
import { actions } from "./GameContext/GameReducer";

const Totals = () => {
    const {players, rounds, bank} = useGame()
    const dispatch = useGameDispatch();

    const totals = useMemo(() => {
      console.log('Recalculating totals')
      // creates totals object with total property
      const totals = {
        total: {
          name: 'total',
          income: 0,
          revenue: 0,
          expenses: 0
        }
      }

      // creates property for each player
      for (const player of players){
        totals[player.id] = {
          name: player.name,
          revenue: 0,
          expenses: 0,
          income: 0
        }
      }
      // sums all records into totals object
      rounds.reduce((accumulator, currentValue) => {
        // adds revenue, expnses and income to corresponding player
        accumulator[currentValue.player_id].income += currentValue.round_income;
        accumulator[currentValue.player_id].expenses += currentValue.salaries_expense;
        accumulator[currentValue.player_id].revenue += currentValue.round_total;
        // adds those to the total expenses as well
        accumulator.total.income += currentValue.round_income;
        accumulator.total.expenses += currentValue.salaries_expense;
        accumulator.total.revenue += currentValue.round_total;
        return accumulator;
      }, totals)

      return totals
    }, [rounds, players])

    const totalRows = useMemo(() => {
      // makes an array to be sorted alphabetically, with totals last
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

      // takes sorted array and turns them into total rows
      const rows = []
      for (const [key, value] of Object.entries(totalsArray)) {
        rows.push(<TotalRow obj={value} key={key} />)
      }

      return rows
    }, [totals])

    useEffect(()=> {
      // updates the bank values if it has been initialized
      const newBankTotal = bank.start + bank.reserve - totals.total.income
      dispatch({
        type: actions.UPDATE_BANK_TOTAL,
        payload: newBankTotal
      })
    },[dispatch, totals.total.income, bank.reserve, bank.start])

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