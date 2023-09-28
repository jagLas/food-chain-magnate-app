#!/usr/bin/env bash

python3 food_chain_api.py db upgrade
gunicorn -b :8000 food_chain_api:app