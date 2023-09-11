import { useMemo, useState } from "react"
import { useGame } from "../GameContext"
import { useParams } from "react-router-dom"

const RoundRow = ({round}) => {
    const {sales} = useGame()
    const {roundNum} = useParams()

    const totals = useMemo(() => {
        let filteredSales = sales.filter((sale)=> {
            return round.player_id === sale.player_id && sale.round === parseInt(roundNum)
        })

        let totals = filteredSales.reduce((accumulator, currentValue) => {
            return {
                salesTotal: accumulator.salesTotal + currentValue.sale_total}
        }, {
            salesTotal: 0
        })

        totals.waitressIncome = round.first_waitress ? round.waitresses * 5 : round.waitresses * 3
        totals.salariesExpense = round.salaries_paid * -5
        totals.preCfoBonus = totals.waitressIncome + totals.salesTotal;
        totals.cfoBonus = round.cfo ? Math.ceil(totals.preCfoBonus * .5) : 0;
        totals.revenue = totals.preCfoBonus + totals.cfoBonus;
        totals.income = totals.revenue + totals.salariesExpense
        return totals
    }, [round, sales])

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
                <td>{totals.waitressIncome}</td>
                <td>{totals.salesTotal}</td>
                <td>{totals.cfoBonus}</td>
                <td>{totals.revenue}</td>
                <td>{totals.salariesExpense}</td>
                <td>{totals.income}</td>
            </tr>
        </>
    )
}

export default RoundRow