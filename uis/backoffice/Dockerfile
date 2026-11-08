FROM node:22-alpine AS node-base

RUN npm install --global npm@11.19.1

FROM node-base AS dependencies

WORKDIR /workspace
COPY uis/backoffice/package.json uis/backoffice/package-lock.json ./uis/backoffice/
RUN cd uis/backoffice && npm ci

FROM node-base AS builder

WORKDIR /workspace
COPY --from=dependencies /workspace/uis/backoffice/node_modules ./uis/backoffice/node_modules
COPY uis/backoffice/ ./uis/backoffice/
WORKDIR /workspace/uis/backoffice

ARG NEXT_PUBLIC_API_URL=https://playground.4geeksacademy.com/tracker/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

FROM node-base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /app
COPY uis/backoffice/package.json uis/backoffice/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /workspace/uis/backoffice/.next ./.next
COPY --from=builder /workspace/uis/backoffice/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]