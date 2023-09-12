export const actions = {
    FETCH_DATA: 'FETCH_DATA',
    ADD_SALE: 'ADD_SALE',
    ADD_ROUNDS: 'ADD_ROUNDS',
    UPDATE_ROUND: 'UPDATE_ROUND',
    UPDATE_BANK_TOTAL: 'UPDATE_BANK_TOTAL'
}

const roundSortingFn = (a,b) => {
    // first sort alphabetically by player name
    if (a.player_name > b.player_name) {
      return 1
    } else if (a.player_name < b.player_name) {
      return -1
    }
    // then sort by round number
    if (a.round > b.round) {
        return -1
    } else if (a.round < b.round) {
        return 1
    }
    return 0
  }

export default function gameReducer(game, action) {
    const {type, payload} = action
    switch (type) {
        case actions.FETCH_DATA:
            return {
                rounds: payload.roundData.sort(roundSortingFn),
                sales: payload.salesData,
                players: payload.playersData,
                bank: payload.bankData
            }
        case actions.ADD_SALE:
            return {
                ...game,
                sales: [...game.sales, payload]
            }
        case actions.ADD_ROUNDS:
            return {
                ...game,
                rounds: [...game.rounds, ...payload].sort(roundSortingFn)
            }
        case actions.UPDATE_ROUND:
            return {
                ...game,
                rounds: game.rounds.map((round) => {
                    if (round.round_id === payload.round_id) {
                        return {
                            ...round,
                            ...payload
                        }
                    }
                    return round
                })
            }
        case actions.UPDATE_BANK_TOTAL:
            const incomeTotal = payload
            return {
                ...game,
                bank: {
                    ...game.bank,
                    total: incomeTotal
                }
            }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}