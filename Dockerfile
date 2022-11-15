FROM node:16.14.2

EXPOSE 3333

WORKDIR /app

COPY . .

CMD yarn \
    && yarn db:migrate-prod \
    && yarn db:seed \
    && yarn start:all
