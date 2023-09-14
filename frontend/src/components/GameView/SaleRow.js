import { useParams } from "react-router-dom";
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { actions } from "./GameContext/GameReducer"

export default function SaleRow({sale}) {
    const dispatch = useGameDispatch();
    const {gameId} = useParams();

    const deleteSale = async () => {
        console.log(sale.sale_id)
        let data = await fetch(`${process.env.REACT_APP_DB_URL}/games/${gameId}/sales/${sale.sale_id}`,{
            method: 'DELETE'
        });

        data = await data.json();

        dispatch({
            type: actions.DELETE_SALE,
            payload: sale.sale_id
        })

        dispatch({
            type: actions.UPDATE_ROUND,
            payload: data
        })
    }

    return (
        <tr>
            <td>{sale.round}</td>
            <td>{sale.player_id}</td>
            <td>{sale.house_number}</td>
            <td>{sale.garden ? 'X' : ' '}</td>
            <td>{sale.burgers}</td>
            <td>{sale.pizzas}</td>
            <td>{sale.drinks}</td>
            <td>{sale.unit_price}</td>
            <td>{sale.base_revenue}</td>
            <td>{sale.garden_bonus}</td>
            <td>{sale.burger_bonus}</td>
            <td>{sale.pizza_bonus}</td>
            <td>{sale.drink_bonus}</td>
            <td>{sale.sale_total}</td>
            <td>
                <button
                    onClick={deleteSale}
                >delete</button>
            </td>
        </tr>
    )
}