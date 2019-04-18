# Plan

- Simple sangria graphql API
- Prisma from existing
- Prisma from declaration
- Subscriptions from both sangria and prisma


## Running

```bash
cd sangria-akka-http-example
sbt docker:publish-local
docker run -d -P sangria-akka-http-example:0.1-SNAPSHOT
cd ../prisma-existing-database
docker run -d -P -e POSTGRES_PASSWORD=<password> postgres
# create database using sql or whatever
prisma init hello-world
prisma deploy

cd ../../aggregator
npm run build
npm start
```

Go to localhost:4000