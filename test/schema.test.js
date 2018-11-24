import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import typeDefs from '../src/graphql/schema';

const schema = makeExecutableSchema(typeDefs);

addMockFunctionsToSchema({ schema });

const query = `
query User {
  User(id: 1) { id, name, email, firstName, lastName }
}
`;

describe('sfasdfasdf', () => {
  test('if this works', () => {
    graphql(schema, query).then((result) => console.log('Got result', result));
  });
});
