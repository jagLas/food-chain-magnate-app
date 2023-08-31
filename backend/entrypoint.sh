#!/usr/bin/env bash

python3 food_chain_api.py db upgrade
python3 -u food_chain_api.py run -h 0.0.0.0 --debug
