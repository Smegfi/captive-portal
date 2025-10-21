FROM node:lts-alpine AS install-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:lts-alpine AS build

WORKDIR /app

COPY --from=install-dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/* ./

EXPOSE 3000

CMD ["npm", "run", "start"]