FROM node:22-alpine AS node-base

RUN npm install --global npm@11.19.1

FROM node-base AS dependencies

WORKDIR /workspace
COPY uis/website/package.json uis/website/package-lock.json ./uis/website/
RUN cd uis/website && npm ci

FROM node-base AS builder

WORKDIR /workspace
COPY --from=dependencies /workspace/uis/website/node_modules ./uis/website/node_modules
COPY uis/website/ ./uis/website/
COPY src/ ./src/
WORKDIR /workspace/uis/website

RUN npm run build

FROM node-base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /workspace
COPY uis/website/package.json uis/website/package-lock.json ./uis/website/
WORKDIR /workspace/uis/website
RUN npm ci --omit=dev

COPY --from=builder /workspace/uis/website/.next ./.next
COPY --from=builder /workspace/uis/website/public ./public
COPY --from=builder /workspace/uis/website/next.config.ts ./next.config.ts
COPY --from=builder /workspace/src /workspace/src

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]