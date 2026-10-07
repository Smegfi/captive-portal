FROM node:lts-alpine AS install-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=install-dependencies /app/node_modules ./node_modules
COPY . .

# Required at build time because Next.js evaluates server modules while collecting page data.
# Runtime should override these via docker run / compose env.
ARG DATABASE_URL=postgresql://ci:ci@127.0.0.1:5432/ci
ARG BETTER_AUTH_SECRET=ci-build-secret
ARG BETTER_AUTH_URL=http://localhost:3000

RUN DATABASE_URL="$DATABASE_URL" \
    BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
    BETTER_AUTH_URL="$BETTER_AUTH_URL" \
    npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]