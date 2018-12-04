import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';

global.XMLHttpRequest = XMLHttpRequest;

describe('trip resolvers', () => {
  test('create trip', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
      mutation{
        createTrip( trip: {
  name:"Voyage des seniors dev",
  participants:["berta@flock.io", "christopher@flock.io"],
  destination:{
    isDictated: true,
    suggestions:[{name: "Palma de Mallorca"}]
  },
  budget: {suggestions: [{value: 100}]},
	timeFrame: {
    isDictated: false,
   suggestions: [
    {
      startDate: "2018-12-24",
      endDate: "2018-12-25"
    }
  ]
  }
})
  {

    name
    participants{
      email
      firstName
      lastName

    }
  }
      }
      `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        createTrip: {
          name: 'Voyage des seniors dev',
          participants: [
            {
              email: 'christopher@flock.io',
              firstName: 'Christopher',
              lastName: 'Bücklein'
            },
            {
              email: 'berta@flock.io',
              firstName: 'Berta',
              lastName: 'Cume'
            }
          ]
        }
      }
    });
  });

  test('addOrVoteForBudget', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
      mutation{
  addOrVoteForBudget(tripID:  "000000000000000000000000", budget: {value: 100})
  {
    budget{
      suggestions{
       value
      }
    }
  }
}
      `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        addOrVoteForBudget: {
          budget: {
            suggestions: [
              {
                value: 500
              },
              {
                value: 100
              }
            ]
          }
        }
      }
    });
  });

  test('addOrVoteForTimeFrame', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        mutation{
          addOrVoteForTimeFrame(tripID: "000000000000000000000000", timeFrames: {startDate: "2018-12-25", endDate: "2018-12-26"})
      {
        timeFrame{
          suggestions{
            voters{
              email
            }
            startDate
            endDate
          }
        }
      }
    }
        `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        addOrVoteForTimeFrame: {
          timeFrame: {
            suggestions: [
              {
                voters: [
                  {
                    email: 'christopher@flock.io'
                  },
                  {
                    email: 'marco@flock.io'
                  }
                ],
                startDate: '2018-12-16T00:00:00.000Z',
                endDate: '2018-12-23T00:00:00.000Z'
              },
              {
                voters: [
                  {
                    email: 'christopher@flock.io'
                  },
                  {
                    email: 'marco@flock.io'
                  }
                ],
                startDate: '2018-12-16T00:00:00.000Z',
                endDate: '2018-12-23T00:00:00.000Z'
              },
              {
                voters: [],
                startDate: '2018-12-25T00:00:00.000Z',
                endDate: '2018-12-26T00:00:00.000Z'
              }
            ]
          }
        }
      }
    });
  });
});

// describe('user resolvers', () => {
//   test('allUsers', async () => {
//     const response = await axios.post('http://localhost:4000/graphql', {
//       query: `
//       query {
//         allUsers {
//           firstName
//           lastName
//           email
//         }
//       }
//       `
//     });
//
//     const { data } = response;
//     expect(data).toMatchObject({
//       data: {
//         allUsers: [
//           {
//             firstName: 'Damien',
//             lastName: 'Derail',
//             email: 'damien@flock.io'
//           },
//           {
//             firstName: 'Christopher',
//             lastName: 'Bücklein',
//             email: 'christopher@flock.io'
//           },
//           {
//             firstName: 'Berta',
//             lastName: 'Cume',
//             email: 'berta@flock.io'
//           },
//           {
//             firstName: 'Arturo',
//             lastName: 'Moreira Santos',
//             email: 'arturo@flock.io'
//           },
//           {
//             firstName: 'Berta1',
//             lastName: 'Cume',
//             email: 'berta1@flock.io'
//           },
//           {
//             firstName: 'Damien1',
//             lastName: 'Derail',
//             email: 'damien1@flock.io'
//           },
//           {
//             firstName: 'Christopher1',
//             lastName: 'Bücklein',
//             email: 'christopher1@flock.io'
//           },
//           {
//             firstName: 'Marco',
//             lastName: 'Kunz',
//             email: 'marco@flock.io'
//           },
//           {
//             firstName: 'Arturo1',
//             lastName: 'Moreira Santos',
//             email: 'arturo1@flock.io'
//           },
//           {
//             firstName: 'Marco1',
//             lastName: 'Kunz',
//             email: 'marco1@flock.io'
//           }
//         ]
//       }
//     });
//   });
// });
// test('create user', async () => {
//   const response = await axios.post('http://localhost:4000/graphql', {
//     query: `
//     mutation {
//       register(email: "testuser@testuser.com", password: "tester", user: {firstName: 'test', lastName: 'user'}) {
//         {
//           firstName
//           lastName
//           email
//         }
//       }
//     }
//     `
//   });
//
//   const { data } = response;
//   expect(data).toMatchObject({
//     data: {
//       register: {
//         user: {
//           firstName: 'test',
//           lastName: 'user',
//           email: 'testuser@testuser.com'
//         }
//       }
//     }
//   });
//
//   const response2 = await axios.post('http://localhost:4000/graphql', {
//     query: `
//     mutation {
//       login(email: "testuser@testuser.com", password: "tester") {
//         token
//         refreshToken
//       }
//     }
//     `
//   });
//
//   const {
//     data: {
//       login: { token, refreshToken }
//     }
//   } = response2.data;

// const response3 = await axios.post(
//   'http://localhost:4000/graphql',
//   {
//     query: `
//   mutation {
//     createTeam(name: "team1") {
//       ok
//       team {
//         name
//       }
//     }
//   }
//   `
//   },
//   {
//     headers: {
//       'x-token': token,
//       'x-refresh-token': refreshToken
//     }
//   }
// );

// expect(response3.data).toMatchObject({
//   data: {
//     createTeam: {
//       ok: true,
//       team: {
//         name: 'team1'
//       }
//     }
//   }
// });
