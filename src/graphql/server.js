import { ApolloServer } from 'apollo-server';
import graphQlSchema from './schema';

export default {
  launch: (config = {}, port = 4000) => {
    const server = new ApolloServer({
      ...graphQlSchema,
      ...config,
      context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // check from req
          const token = req.headers.authorization || '';

          return { token };
        }
      }
    });
    server.listen({ port }).then(({ url }) => {
      console.log(`✔️  GraphQL up and running, playground ready at ${url}`); // eslint-disable-line no-console
    });
  }
};
