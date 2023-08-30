#!/usr/bin/env bash

pip3 install -r /app/requirements.txt
python3 food_chain_api.py db upgrade
python3 food_chain_api.py run -h 0.0.0.0 --debug