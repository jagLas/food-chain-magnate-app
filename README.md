# food-chain-magnate-app

## About

This repository holds the code for a full stack app to manage and store game information, such as sales, totals, milestones, for the board game [Food Chain Magnate by Splotter Spellen](https://www.splottershop.com/products/food-chain-magnate). This app is intended to work as a compainion app to the board game, and cannot be used as a standalone game.

## Work in Progress

This app's development is still in progress, but should have the necessary features to track game information from start to finish. Additional features and QOL improvements will come.

## How to run

### Install and setup docker

This project can be run with [Docker](https://www.docker.com/). Please follow their documentation to install and set up Docker.

### Copy .env_example

Copy the .env_example fil to a .env file in the root folder of the project. Configure the .env variables to inputs of your choosing.

### Run docker-compose up

Once Docker has been installed and the .env file has been created, run docker-compose up from the root directory to start up the db, api, and frontend in a development environment.

### Seed the DB (optional)

If you wish to seed the database some example data, make a 'GET' request to the /seed-db route in a browser.

### Load the site

After that, you can run the app by visiting the link and port specified in the .env (http://localhost:3000 by default)

## Additional Information

More detailed information can be found in the backend and frontend READMEs linked below.

### [Backend API README](/backend/README.md)

### [Frontend README](/frontend/README.md)

## Credit

This site's design is inspired by the design from the board game "Food Chain Magnate" by Splotter Spellen, with one asset directly used from the game's art.

This site uses the following free webfonts:

- [Bazooka Regular](https://webfonts.ffonts.net/Bazooka-Regular.font)
- [Pacifico](https://fonts.google.com/specimen/Pacifico)
- [Anja Eliane](https://www.dafont.com/anja-eliane.font)