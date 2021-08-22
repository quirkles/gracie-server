FROM node:14.17-alpine

# update packages
RUN apk update

ENV PORT=8080

# create root application folder
WORKDIR /app

RUN mkdir prisma
RUN mkdir logs

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma/schema.prisma ./prisma
# copy source code to /src folder
COPY src ./src
COPY src/nexus-typegen.ts ./src
COPY src/schema.graphql ./src

RUN ls src

RUN npm install
RUN npm run prisma:generate
RUN npm run build

EXPOSE $PORT

CMD [ "node", "./dist/api/index.js" ]
