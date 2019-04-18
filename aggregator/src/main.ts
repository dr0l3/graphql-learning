import { ApolloServer } from 'apollo-server';
import {makeRemoteExecutableSchema, introspectSchema, mergeSchemas, makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';
import typeDefs from './schemas';

import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

const userLink = new HttpLink({ uri: 'http://localhost:4466', fetch: fetch});
const starWarsLink = new HttpLink({uri: 'http://localhost:32768/graphql', fetch: fetch});

async function createSchemas() {
  const userSchema = await introspectSchema(userLink);
  const starWarsSchema = await introspectSchema(starWarsLink);

  const executableSchema = makeRemoteExecutableSchema({
    schema: userSchema,
    link: userLink,
  });

  const executableSchema2 = makeRemoteExecutableSchema({
      schema: starWarsSchema,
      link: starWarsLink
  })

  const localSchema = makeExecutableSchema({resolvers, typeDefs})

  const merged = mergeSchemas({
    schemas: [executableSchema, executableSchema2, localSchema]
  });

  return merged
}

let schemaPromise = createSchemas()
schemaPromise.then(schema => {
    const server = new ApolloServer({schema: schema})

    server.listen()
    .then(({url}) => console.log(`Server started at ${url}`))
} )


// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}