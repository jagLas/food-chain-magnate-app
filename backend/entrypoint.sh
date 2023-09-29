#!/usr/bin/env bash

python3 app.py db upgrade
python3 -u app.py run -h 0.0.0.0
