FROM node:lts-alpine AS base

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build

RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate && npm run build

FROM base AS release

COPY --from=build /home/node/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /home/node/app/prisma ./prisma
COPY --from=build /home/node/app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
