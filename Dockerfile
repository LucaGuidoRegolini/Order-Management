FROM node:14.17-alpine

WORKDIR /usr/app/

COPY . .
RUN npm install

RUN npm run build


EXPOSE ${API_PORT}

CMD ['npm', 'run', ${NODE_START}]
