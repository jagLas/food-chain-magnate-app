import { useParams } from "react-router-dom";
import { useGame, useGameDispatch } from "../GameContext/GameContext"
import { actions } from "../GameContext/GameReducer"
import { authFetch, useDelete } from "../../../utilities/auth";

export default function SaleRow({sale}) {
    const dispatch = useGameDispatch();
    const {gameId} = useParams();
    const {players} = useGame();

    const dataProcessor = () => {
        dispatch({
            type: actions.DELETE_SALE,
            payload: sale.sale_id
        })

        dispatch({
            type: actions.UPDATE_ROUND,
            payload: data
        })
    }

    const [data, isProcessing, deleteData] = useDelete(`/games/${gameId}/sales/${sale.sale_id}`, dataProcessor)

    const deleteSale = async () => {
        deleteData()
    }

    return (
        <div className="table-row">
            <div className="player-name-field">
                {players.find(player => player.id === sale.player_id).name}
            </div>
            <div className="table-subgroup" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div className="round-field">
                    <div>Round</div>
                    {sale.round}
                </div>
                <div className="round-field">
                    <div>House</div>
                    {sale.house_number}
                </div>
                <div className="round-field">
                    <div htmlFor={'garden-' + sale.sale_id}>Garden</div>
                    {sale.garden ?
                        <input id={'garden-' + sale.sale_id} readOnly={true} checked={true} type="checkbox"/> :
                        <input id={'garden-' + sale.sale_id} readOnly={true} checked={false} type="checkbox"/>
                    }
                </div>
                <div className="round-field">
                    <div>Burgers</div>
                    {sale.burgers}
                </div>
                <div className="round-field">
                    <div>Pizzas</div>
                    {sale.pizzas}
                </div>
                <div className="round-field">
                    <div>Drinks</div>
                    {sale.drinks}
                </div>
            </div>
            <div className="table-subgroup sale-optional-calcs"  style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
                <div className="round-field">
                    <div>Unit Price</div>{sale.unit_price}</div>
                    <div className="round-field">
                    <div>Base Revenue</div>{sale.base_revenue}</div>
                    <div className="round-field">
                    <div>Garden Bonus</div>{sale.garden_bonus}</div>
                    <div className="round-field">
                    <div>Burger Bonus</div>{sale.burger_bonus}</div>
                    <div className="round-field">
                    <div>Pizza Bonus</div>{sale.pizza_bonus}</div>
                    <div className="round-field">
                    <div>Drink Bonus</div>{sale.drink_bonus}</div>
            </div>
            <div className="table-subgroup">
                <div  style={{fontWeight: '600'}} className="round-field">
                    <div className="single-row-label">
                        Sale Total
                    </div>
                    {sale.sale_total}
                </div>
            </div>
            <div className="table-subgroup" style={{padding: '4px'}}>
                <button
                    className="delete-sale"
                    onClick={deleteSale}
                >
                    delete
                </button>
            </div>
        </div>
    )
}