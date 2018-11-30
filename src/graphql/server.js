import { ApolloServer } from 'apollo-server';
import graphQlSchema from './schema';
import jwt from 'jsonwebtoken';

export default {
  launch: (models, config = {}, port = 4000) => {
    const server = new ApolloServer({
      ...graphQlSchema,
      ...config,
      context: ({ req }) => {
        const context = { ...models };
        let authHeader = req.headers.authorization || '';
        authHeader = authHeader.replace('Bearer ', '');
        if (authHeader) {
          // TODO verify() necessary?
          context['user'] = jwt.decode(authHeader);
        }
        return context;
      }
    });
    server.listen({ port }).then(({ url }) => {
      console.log(`✔️  GraphQL up and running, playground ready at ${url}`); // eslint-disable-line no-console
    });
  }
};

/* ({ req }) => {
  // get the user token from the headers
  const token = req.headers.authorization || '';

  // try to retrieve a user with the token
  const user = getUser(token);

  // add the user to the context
  return { user };
},
}); */
