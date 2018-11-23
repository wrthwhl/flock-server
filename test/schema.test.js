import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import typeDefs from '../src/graphql/schema';

const schema = makeExecutableSchema({ typeDefs: typeDefs });

addMockFunctionsToSchema({ schema });

const query = `
query User {
  user(id: 1) { id, name, email, firstName, lastName }
}
`;

graphql(schema, query).then((result) => console.log('Got result', result));

/*

const testCaseA = {
  id        : 'Test case A',
  query     : `
    query {
      users {
        origin
      }
    }
  `,
  variables : {},
  context   : {},
  expected  : { data: { animals: [ { kind: 'Dog' } ] } }
};

describe('Schema', () => {
  // Array of case types
  const cases = [ testCaseA ];

  const mockSchema = makeExecutableSchema({ typeDefs });

  // Here we specify the return payloads of mocked types
  addMockFunctionsToSchema({
    schema : mockSchema,
    mocks  : {
      Boolean : () => false,
      ID      : () => '1',
      Int     : () => 1,
      Float   : () => 12.34,
      String  : () => 'Dog'
    }
  });

  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs);

      await MockServer.query(`{ __schema { types { name } } }`);
    }).not.toThrow();
  });

  cases.forEach((obj) => {
    const { id, query, variables, context: ctx, expected } = obj;

    test(`query: ${id}`, async () => {
      return await expect(graphql(mockSchema, query, null, { ctx }, variables)).resolves.toEqual(expected);
    });
  });
});
 */
