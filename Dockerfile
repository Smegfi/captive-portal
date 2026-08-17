FROM node:lts-alpine AS install-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=install-dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]