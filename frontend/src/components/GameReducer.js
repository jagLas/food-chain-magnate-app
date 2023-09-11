export const actions = {
    FETCH_DATA: 'FETCH_DATA',
    ADD_SALE: 'ADD_SALE',
    ADD_ROUNDS: 'ADD_ROUNDS'
}

export default function gameReducer(game, action) {
    
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_DATA:
            return {
                rounds: payload.roundData,
                sales: payload.salesData,
                totals: payload.totalsData.sort((a,b)=> {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.name > b.name){
                        return 1
                    }
                    if (a.name === null) {
                        return 1
                    }
                    if (b.name === null) {
                        return -1
                    }
                }),
                players: payload.playersData
            }
        case actions.ADD_SALE:
            return {
                ...game,
                sales: [...game.sales, payload]
            }
        case actions.ADD_ROUNDS:
            return {
                ...game,
                rounds: [...game.rounds, ...payload].sort((a,b)=> {
                    if (a.player_name < b.player_name) {
                        return -1
                    } else{
                        return 1
                    }
                })
            }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}