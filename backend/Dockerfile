# Dep stage

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci

# Build stage

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

#Runtime stage

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/drizzle ./drizzle


EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]







