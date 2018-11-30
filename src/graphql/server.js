import { ApolloServer, AuthenticationError } from 'apollo-server';
import graphQlSchema from './schema';
import jwt from 'jsonwebtoken';

const getJWTPayload = async (headers, res, SECRET) => {
  const authHeader = headers.authorization;
  let key, token;
  authHeader && ([ key, token ] = authHeader.split(' '));
  try {
    if (!token || !key || key.toUpperCase() !== 'BEARER') return {};
    const user = await jwt.verify(token, SECRET);
    return user;
  } catch (err) {
    res.status('401');
    throw new AuthenticationError(
      'Request contains invalid authorization header. Bearer token with valid JWT expected.',
      err
    );
  }
};

export default {
  launch: (models, apolloConfig = {}, port = 4000, SECRET) => {
    const server = new ApolloServer({
      ...graphQlSchema,
      ...apolloConfig,
      context: async ({ req, res, connection }) => {
        let user = {};
        if (!connection) user = await getJWTPayload(req.headers, res, SECRET);
        return { ...models, user };
      },
      subscriptions: {
        onConnect: async (headers) => {
          const user = await getJWTPayload(headers, SECRET);
          return { user };
        }
      }
    });
    server
      .listen({ port })
      .then(({ url }) => console.log(`✔️  GraphQL up and running, playground ready at ${url}`)) // eslint-disable-line no-console
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  }
};
