FROM node:22-alpine

RUN apk add --no-cache bash \
    && npm install --global npm@11.19.1

WORKDIR /workspace/uis

COPY website/package.json website/package-lock.json ./website/
COPY backoffice/package.json backoffice/package-lock.json ./backoffice/

RUN npm --prefix website ci \
    && npm --prefix backoffice ci

COPY website/ ./website/
COPY backoffice/ ./backoffice/
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3000 3001

CMD ["bash", "./start.sh"]