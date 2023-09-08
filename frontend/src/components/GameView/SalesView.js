import SaleRow from "./SaleRow";
import AddSaleForm from "./AddSaleForm";
import { useGame } from "../GameContext";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function SalesView() {
    const sales = useGame().sales
    const {roundNum} = useParams()

    const rows = useMemo(() => {
        const rows = [];
        for (const [key, sale] of Object.entries(sales)) {
            rows.push(<SaleRow sale={sale} key={key} />)
        }
        if (roundNum == 'all') {
            return rows
        }
        return rows.filter(row => {

            return row.props.sale.round_id == roundNum
          })
    })


    return (
        <div id='sale-view'>
            <h2>Sales</h2>
            <AddSaleForm />
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Player Id</th>
                        <th>House #</th>
                        <th>Garden</th>
                        <th>Burgers</th>
                        <th>Pizzas</th>
                        <th>Drinks</th>
                        <th>Unit Price</th>
                        <th>Base Revenue</th>
                        <th>Garden Bonus</th>
                        <th>Burger Bonus</th>
                        <th>Pizza Bonus</th>
                        <th>Drink Bonus</th>
                        <th>Sale Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}