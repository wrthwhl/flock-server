import { makeExecutableSchema, mockServer } from 'graphql-tools';
import typeDefs from '.';

const schema = makeExecutableSchema(typeDefs);

describe('root schema', () => {
  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(schema);
      await MockServer.query('{ __schema { types { name } } }');
    }).not.toThrow();
  });
});
