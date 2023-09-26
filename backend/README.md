# Food Chain Magnate Companion API README

This api provides the necessary functions to store and retrieve game data for the board game "Food Chain Magnate" by Splotter Spellen. An account is necessary to use this api.


## Creating an Account and Retrieving Authorization

Authorization cookies can be obtained using the following methods. An account must be created to use this api.

# Signup

You may sign up for an account by making a 'POST' request to '/auth/signup' with JSON data that includes a name, email, and password.


    POST /auth/signup
    Content-Type: application/json

    {
        "name": "name",
        "email": "email@domain.com",
        "password": "password"
    }


## Get Authorization cookies

The following route retrieves the necessary authorization cookies.

    POST /auth/login
    Content-Type: application/json

    {
        "email": "email@domain.com",
        "password": "password"
    }

## Logout

    POST /auth/logout
    Cookie: access_token_cookie="webtoken"; csrf_access_token="token"


# Routes

All of the following routes must include the access_token_cookie in the request.

    GET
    Cookie: access_token_cookie="webtoken"

POST, PUT, PATCH, and DELETE methods must also include the csrf_access_token cookie as a value of the X-CSRF-TOKEN header in the request. They also require that Content-Type be specified as "application/json".

    POST, PUT, PATCH OR DELETE
    Cookie: access_token_cookie="webtoken"
    X-CSRF-TOKEN: csrf_access_token
    Content-Type: application/json

***Examples in the following section do not show these requirements for the sake of brevity***

## Get all games

Retrieves an array of all games for a user.

### Request
    GET /games

### Response

    [
        {
            "id": 1,
            "bank_start": 200,
            "bank_reserve": 100,
            "players": [
                {
                    "id": 1,
                    "name": "Gloria"
                },
                {
                    "id": 2,
                    "name": "Jean"
                }
            ]
        }
    ]

## Create a game

Creates a game linked to the user and returns the new game record.

    POST /games

    {
        "bank_start": 100,
        "player_ids": [1, 2]
    }

## Retrieve Round Records

Retrieve an array all round records for a given game_id. Each round record contains information about the round, such as the round number, the player_id that the record is for, milestone information, number of waitresses, unit price, salaries paid, and all calculated totals for a specific round. A complete list of returned values can be seen an the example response.

### Request
    GET /games/:game_id/rounds

### Response

    [
        {
            "round_id": 3,
            "round": 2,
            "first_burger": false,
            "first_pizza": false,
            "first_drink": true,
            "first_waitress": true,
            "cfo": true,
            "player_id": 1,
            "player_name": "Gloria",
            "unit_price": 10,
            "waitresses": 1,
            "waitress_income": 5,
            "salaries_paid": 0,
            "salaries_expense": 0,
            "revenue": 20,
            "sale_total": 30,
            "burger_bonus": 0,
            "pizza_bonus": 0,
            "drink_bonus": 10,
            "pre_cfo_total": 35,
            "cfo_bonus": 18,
            "round_total": 53,
            "round_income": 53
        }
    ]

## Create New Round Records

## Modify Round Records

## Get All Sale Records

## Add a sale record

## Delete a sale record

## Get Game Players

## Get Game Bank

## Modify Bank

## Get Players

## Add a Player

# To-do and possible future development

## Routes:

- [x] Get a list of all Games
- [x] Make a new Game
- [x] Retrieve list of players
- [x] Create a new player
- [x] Get player totals for a game
- [x] Get bank totals for a game
- [x] Make a new round
- [x] Make a new sale
- [ ] Routes to edit entries
  - [ ] Edit a sale
  - [x] Edit a round
  - [x] Edit a game
  - [x] Edit a player
  - [ ] Edit an account
- [ ] Routes to delete entries
  - [x] Delete a Sale
  - [ ] Delete a Round
  - [x] Delete a Game
  - [x] Delete a Player
  - [ ] Delete an Account
- [ ] Player Statistics
- [ ] Game Statistics

## Features
- [X] Authentication
- [ ] Stats