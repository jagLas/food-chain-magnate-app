FROM node:20-alpine3.17 as base
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH

# Development

FROM base as dev

ENV NODE_ENV=development

WORKDIR /app

RUN npm install --only=development

CMD ["npm", "start"]