FROM python:3.11-slim as base
WORKDIR /app
COPY ./requirements.txt .
RUN pip3 install -r /app/requirements.txt
COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh
ENV FLASK_APP=app.py

FROM base as dev
EXPOSE 5000
ENV FLASK_DEBUG=1
ENV FLASK_ENV=development

FROM base as prod
EXPOSE 8000
ENV ENV=development
ENV FLASK_DEBUG=0
ENV FLASK_ENV=production