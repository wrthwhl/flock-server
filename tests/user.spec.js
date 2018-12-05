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

  test('addParticipants', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        mutation{
          addParticipants(tripID:  "000000000000000000000000", participants: "barbara@flock.io")
          {
            participants{
              email
            }
          }
        }
        `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        addParticipants: {
          participants: [
            {
              email: 'damien@flock.io'
            },
            {
              email: 'christopher@flock.io'
            },
            {
              email: 'berta@flock.io'
            },
            {
              email: 'arturo@flock.io'
            },
            {
              email: 'marco@flock.io'
            },
            {
              email: 'barbara@flock.io'
            }
          ]
        }
      }
    });
  });

  test('remove vote for destination', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `mutation{
          removeVoteForDestination(tripID:"000000000000000000000000", destinationID: "111111111111111111111111")
        {
          destination{
            suggestions{
              id
              name
              voters{
                email
                }
              }
            }
        }
      }`
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        removeVoteForDestination: {
          destination: {
            suggestions: [
              {
                id: '000000000000000000000000',
                name: 'Barcelona',
                voters: [
                  {
                    email: 'damien@flock.io'
                  },
                  {
                    email: 'berta@flock.io'
                  }
                ]
              },
              {
                id: '111111111111111111111111',
                name: 'Berlin',
                voters: [
                  {
                    email: 'damien@flock.io'
                  },
                  {
                    email: 'berta@flock.io'
                  }
                ]
              },
              {
                id: '222222222222222222222222',
                name: 'Zurich',
                voters: [
                  {
                    email: 'berta@flock.io'
                  },
                  {
                    email: 'marco@flock.io'
                  }
                ]
              }
            ]
          }
        }
      }
    });
  });

  test('add vote for destination', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        mutation{
          addOrVoteForDestination(tripID:"000000000000000000000000", destinations: {name: "Zurich"})
            {
              destination{
                suggestions{
                name
                voters{
                  email
                  }
              }
            }
          }
        }
      `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        addOrVoteForDestination: {
          destination: {
            suggestions: [
              {
                name: 'Barcelona',
                voters: [
                  {
                    email: 'damien@flock.io'
                  },
                  {
                    email: 'berta@flock.io'
                  }
                ]
              },
              {
                name: 'Berlin',
                voters: [
                  {
                    email: 'damien@flock.io'
                  },
                  {
                    email: 'berta@flock.io'
                  }
                ]
              },
              {
                name: 'Zurich',
                voters: [
                  {
                    email: 'berta@flock.io'
                  },
                  {
                    email: 'marco@flock.io'
                  }
                ]
              }
            ]
          }
        }
      }
    });
  });
});

describe('user resolvers', () => {
  test('update user', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        mutation{
          updateUser(id: "111111111111111111111111", update: {firstName: "Christopherausor"})
          {
            firstName
            lastName
          }
        }
      `
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        updateUser: {
          firstName: 'Christopherausor',
          lastName: 'Bücklein'
        }
      }
    });
  });

  // test('allUsers', async () => {
  //   const response = await axios.post('http://localhost:4000/graphql', {
  //     query: `
  //         {
  //           allUsers {
  //             firstName
  //             lastName
  //
  //           }
  //         }
  //         `
  //   });
  //
  //   const { data } = response;
  //   expect(data).toMatchObject({
  //     data: {
  //       allUsers: [
  //         {
  //           firstName: 'Damien',
  //           lastName: 'Derail'
  //         },
  //         {
  //           firstName: 'Berta',
  //           lastName: 'Cume'
  //         },
  //         {
  //           firstName: 'Christopherausor',
  //           lastName: 'Bücklein'
  //         },
  //         {
  //           firstName: 'Arturo',
  //           lastName: 'Moreira Santos'
  //         },
  //         {
  //           firstName: 'Marco',
  //           lastName: 'Kunz'
  //         },
  //         {
  //           firstName: 'Damien1',
  //           lastName: 'Derail'
  //         },
  //         {
  //           firstName: 'Christopher1',
  //           lastName: 'Bücklein'
  //         },
  //         {
  //           firstName: 'Berta1',
  //           lastName: 'Cume'
  //         },
  //         {
  //           firstName: 'Arturo1',
  //           lastName: 'Moreira Santos'
  //         },
  //         {
  //           firstName: 'Marco1',
  //           lastName: 'Kunz'
  //         },
  //         {
  //           firstName: null,
  //           lastName: null
  //         }
  //       ]
  //     }
  //   });
  // });

  //
  test('register user', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        mutation {
          register(email: "testuser@testuser.com", password: "tester", user: {firstName: "test", lastName: "user"})
        }
  `
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        register: {}
      }
    });

    const response2 = await axios.post('http://localhost:4000/graphql', {
      query: `
      mutation {
        login(email: "testuser@testuser.com", password: "tester")
      }

      `
    });

    const {
      data: {
        login: { token }
      }
    } = response2.data;

    const response3 = await axios.post(
      'http://localhost:4000/graphql',
      {
        query: `
            {
              self{
                email
                lastName
                firstName
              }
            }
            `
      },
      {
        headers: {
          'x-token': token
          // 'x-token': token,
          // 'x-refresh-token': refreshToken
          // }
        }
      }
    );
    //
    expect(response3.data).toMatchObject({
      data: {
        self: {
          email: 'testuser@testuser.com',
          lastName: 'user',
          firstName: 'test'
        }
      }
    });
  });
});
