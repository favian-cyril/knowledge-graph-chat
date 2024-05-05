FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG PRIVATE_AZURE_OPENAI_KEY
ARG PRIVATE_AZURE_OPENAI_ENDPOINT
ARG PRIVATE_NEO4J_USERNAME
ARG PRIVATE_NEO4J_PASSWORD
ARG PRIVATE_NEO4J_ENDPOINT

RUN npm run build
