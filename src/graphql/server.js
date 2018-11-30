import { ApolloServer, AuthenticationError } from 'apollo-server';
import graphQlSchema from './schema';
import jwt from 'jsonwebtoken';

const getJWTPayload = async ({ req, res }, SECRET) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return {};
  const [ key, token ] = authHeader.split(' ');
  try {
    if (!key || !token || key.toUpperCase() !== 'BEARER') return res.status('401');
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
      context: async (ctx) => {
        let user = null;
        ctx && typeof ctx.req === 'object' ? (user = await getJWTPayload(ctx, SECRET)) : null;
        return { ...models, user };
      },
      subscriptions: {
        onConnect: async (ctx) => {
          console.log('ctx', ctx.authToken);
          const user = await getJWTPayload(ctx, SECRET);
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
