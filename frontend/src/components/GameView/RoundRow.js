import { useMemo, useState } from "react"
import { useGame } from "../GameContext"
import { useParams } from "react-router-dom"

const RoundRow = ({round}) => {
    const {sales} = useGame();
    const {roundNum} = useParams();

    const [unitPrice, setUnitPrice] = useState(round.unit_price);
    const [cfo, setCfo] = useState(round.cfo);
    const [firstBurger, setFirstBurger] = useState(round.first_burger);
    const [firstPizza, setFirstPizza] = useState(round.first_pizza);
    const [firstDrink, setFirstDrink] = useState(round.first_drink);
    const [firstWaitress, setFirstWaitress] = useState(round.first_waitress);
    const [waitresses, setWaitresses] = useState(round.waitresses);
    const [salariesPaid, setSalariesPaid] = useState(round.salaries_paid);

    // calculates totals for the round
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
                <td>
                    <input
                        checked={firstBurger}
                        type="checkbox"
                        onChange={()=> setFirstBurger(!firstBurger)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstPizza}
                        type="checkbox"
                        onChange={()=> setFirstPizza(!firstPizza)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstDrink}
                        type="checkbox"
                        onChange={()=> setFirstDrink(!firstDrink)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={firstWaitress}
                        type="checkbox"
                        onChange={()=> setFirstWaitress(!firstWaitress)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        checked={cfo}
                        type="checkbox"
                        onChange={()=> setCfo(!cfo)}
                    >
                    </input>
                </td>
                <td>
                    <input
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        type='number'
                    ></input>
                </td>
                <td>
                    <input
                        value={waitresses}
                        onChange={(e) => setWaitresses(e.target.value)}
                        type='number'
                    ></input>
                </td>
                <td>
                    <input
                        value={salariesPaid}
                        onChange={(e) => setSalariesPaid(e.target.value)}
                        type='number'
                    ></input>
                </td>
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