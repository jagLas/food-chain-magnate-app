import { useParams } from "react-router-dom";
import { useGame, useGameDispatch } from "./GameContext/GameContext"
import { actions } from "./GameContext/GameReducer"

export default function SaleRow({sale}) {
    const dispatch = useGameDispatch();
    const {gameId} = useParams();
    const {players} = useGame();

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
        <div className="table-row">
            <div className="player-name-field">
                {players.find(player => player.id == sale.player_id).name}
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div>{sale.round}</div>
                <div>{sale.house_number}</div>
                <div>{sale.garden ? 'X' : ' '}</div>
                <div>{sale.burgers}</div>
                <div>{sale.pizzas}</div>
                <div>{sale.drinks}</div>
            </div>
            <div className="table-subgroup optional-calcs"  style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div>{sale.unit_price}</div>
                <div>{sale.base_revenue}</div>
                <div>{sale.garden_bonus}</div>
                <div>{sale.burger_bonus}</div>
                <div>{sale.pizza_bonus}</div>
                <div>{sale.drink_bonus}</div>
            </div>
            <div className="table-subgroup">{sale.sale_total}</div>
            <div className="table-subgroup">
                <button
                    onClick={deleteSale}
                >delete</button>
            </div>
        </div>
    )
}