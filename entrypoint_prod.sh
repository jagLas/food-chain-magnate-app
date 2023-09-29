#!/usr/bin/env bash

python3 app.py db upgrade
gunicorn -b :8000 app:app