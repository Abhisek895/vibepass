FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

ARG SERVICE_ENTRY=src/main.ts
ENV SERVICE_ENTRY=${SERVICE_ENTRY}

EXPOSE 3003 4001 4002 4003 4004 4005

CMD ["sh", "-c", "npx ts-node ${SERVICE_ENTRY}"]

