const data = {
  users: [
    {
      id: 1,
      firstName: 'Damien',
      lastName: 'Derail',
      email: 'damien@nuts.io',
      avatar_url:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      id: 2,
      firstName: 'Christopher',
      lastName: 'Bücklein',
      email: 'christopher@nuts.io',
      avatar_url:
        'https://lh3.googleusercontent.com/-VSwsPyjYXGY/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-gk_wJCQYzx0KwsZMWANFn5M53qTw/s192-c-mo/photo.jpg'
    },
    {
      id: 3,
      firstName: 'Berta',
      lastName: 'Cume',
      email: 'berta@nuts.io',
      avatar_url:
        'https://lh3.googleusercontent.com/-VSwsPyjYXGY/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-gk_wJCQYzx0KwsZMWANFn5M53qTw/s192-c-mo/photo.jpg'
    },
    {
      id: 4,
      firstName: 'Arturo',
      lastName: 'Moreira Santos',
      email: 'arturo@nuts.io',
      avatar_url:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      id: 5,
      firstName: 'Marco',
      lastName: 'Kunz',
      email: 'marco@nuts.io',
      avatar_url:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    }
  ]
};

const users = users => {
  let res = [];
  users.forEach(({ firstName, lastName }, id) =>
    res.push({
      id,
      firstName,
      lastName,
      email: firstName.toLowerCase() + '@travelnuts.io'
    })
  );
  return res;
};




const dataTrip = {
  trips: [
    {
      name: 'Graduation Trip',
      participants: [0, 1, 2, 3, 4],
      destination: {
        chosenDestination: 'barcelona',
        suggestions: {
          grenoble: {
            voters: [0],
            creator: 0
          },
          cologne: {
            voters: [1],
            creator: 1
          },
          barcelona: {
            voters: [2],
            creator: 2
          },
          saoPaulo: {
            voters: [3],
            creator: 3
          },
          zurich: {
            voters: [4],
            creator: 4
          }
        }
      },
      budget: {
        chosenBudget: 500,
        suggestions: {
          500: {
            voters: [0],
            creator: 0
          },
          600: {
            voters: [1],
            creator: 1
          },
          700: {
            voters: [2],
            creator: 2
          },
          1000: {
            voters: [3],
            creator: 3
          },
          400: {
            voters: [4],
            creator: 4
          }
        }
      },
      timeFrame: {
        chosenTimeFrame: '2018-12-16',
        suggestions: {
          0: {
            startDate: '2018-12-16',
            endDate: '2018-12-23',
            voters: [0],
            creator: 0
          },
          1: {
            startDate: '2018-12-16',
            endDate: '2018-12-23',
            voters: [1],
            creator: 1
          },
          2: {
            startDate: '2018-12-16',
            endDate: '2018-12-23',
            voters: [2],
            creator: 2
          },
          3: {
            startDate: '2018-12-16',
            endDate: '2018-12-23',
            voters: [3],
            creator: 3
          },
          4: {
            startDate: '2018-12-16',
            endDate: '2018-12-23',
            voters: [4],
            creator: 4
          }
        }
      }
    }
  ],
  destinations: {
    cologne: {
      name: 'Köln'
    },
    grenoble: {
      name: 'Grenoble'
    },
    barcelona: {
      name: 'Barcelona'
    },
    saoPaulo: {
      name: 'São Paulo'
    },
    zurich: {
      name: 'Zurich'
    }
  }
};



// const trips = trips => {
//   return trips.map((trip, id) => ({
//     id: {
//       id,
//       ...trip
//     }
//   }));
// };

// console.log('hey', users(data.users)); // eslint-disable-line no-console
// console.log('hey', trips(dataTrip.trips)); // eslint-disable-line no-console
export default {
  users: users(data.users),
  trips: dataTrip.trips
  // trips: trips(data.trips),
  // destinations: trips(data.destinations)
};
