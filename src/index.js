import config from '../config';
import createServer from './graphql/server';
import * as models from './models';

const server = createServer({ context: models });

server.listen({ port: config.PORT || 4000 }).then(({ url }) => {
  console.log(`✔️  GraphQL up and running, playground ready at ${url}`); // eslint-disable-line no-console
});
