FROM node:14-bullseye

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
