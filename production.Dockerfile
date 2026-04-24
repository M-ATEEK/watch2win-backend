FROM node:14-bullseye AS builder

WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:14-bullseye-slim AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder /usr/src/app /usr/src/app

EXPOSE 8000

CMD ["npm", "start"]
