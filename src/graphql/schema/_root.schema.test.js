import { mockServer } from 'graphql-tools';
import { typeDefs } from '.';

describe('root schema', () => {
  test('has valid type definitions', async () => {

    expect(async () => {
      const MockServer = mockServer(typeDefs);
      await MockServer.query('{ __schema { types { name } } }');
    }).not.toThrow();
  });
});
