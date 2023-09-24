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

POST, PUT, PATCH, and DELETE methods must also include the csrf_access_token in the request.

    POST, PUT, PATCH OR DELETE
    Cookie: access_token_cookie="webtoken"; csrf_access_token="token"

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
  - [ ] Edit a game
  - [ ] Edit a player
  - [ ] Edit an account
- [ ] Routes to delete entries
  - [x] Delete a Sale
  - [ ] Delete a Round
  - [ ] Delete a Game
  - [ ] Delete a Player
  - [ ] Delete an Account
- [ ] Player Statistics
- [ ] Game Statistics

## Features
- [X] Authentication
- [ ] Stats