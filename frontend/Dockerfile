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

FROM base as build
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:stable-alpine as prod

COPY --from=build /app/build /usr/share/nginx/html
COPY /nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]