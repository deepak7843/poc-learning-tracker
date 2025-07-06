FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# commonad for docker build👇👇
# **1-docker build -t learning:dev .**
# learning- any project name which we want to give

# 2- **docker images

# 3-docker run -p 5173:5173 --env-file  .env  learning:dev**