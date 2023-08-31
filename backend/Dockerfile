FROM python:3.11-slim

WORKDIR /app
COPY ./requirements.txt .

EXPOSE 5000
RUN pip3 install -r /app/requirements.txt

COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh