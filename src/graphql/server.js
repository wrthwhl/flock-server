import { ApolloServer } from 'apollo-server';
import graphQlSchema from './schema';

export default {
  launch: (config = {}, port = 4000) => {
    const server = new ApolloServer({
      ...graphQlSchema,
      ...config
    });
    server.listen({ port }).then(({ url }) => {
      console.log(`✔️  GraphQL up and running, playground ready at ${url}`); // eslint-disable-line no-console
    });
  }
};
