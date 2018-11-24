const data = {
  users        : [
    {
      firstName : 'Damien',
      lastName  : 'Derail',
      avatar    : ''
    },
    {
      firstName : 'Christopher',
      lastName  : 'Bücklein',
      avatarURL :
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      firstName : 'Berta',
      lastName  : 'Cume',
      avatar    : ''
    },
    {
      firstName : 'Arturo',
      lastName  : 'Moreira Santos',
      avatar    : ''
    },
    {
      firstName : 'Marco',
      lastName  : 'Kunz',
      avatar    : ''
    }
  ],
  trips        : [
    {
      name         : 'Graduation Trip',
      participants : [ 0, 1, 2, 3, 4 ],
      destination  : {
        chosenDestination : 'barcelona',
        suggestions       : {
          grenoble  : {
            voters  : [ 0 ],
            creator : 0
          },
          cologne   : {
            voters  : [ 1 ],
            creator : 1
          },
          barcelona : {
            voters  : [ 2 ],
            creator : 2
          },
          saoPaulo  : {
            voters  : [ 3 ],
            creator : 3
          },
          zurich    : {
            voters  : [ 4 ],
            creator : 4
          }
        }
      },
      budget       : {
        chosenBudget : 500,
        suggestions  : {
          500  : {
            voters  : [ 0 ],
            creator : 0
          },
          600  : {
            voters  : [ 1 ],
            creator : 1
          },
          700  : {
            voters  : [ 2 ],
            creator : 2
          },
          1000 : {
            voters  : [ 3 ],
            creator : 3
          },
          400  : {
            voters  : [ 4 ],
            creator : 4
          }
        }
      },
      timeFrame    : {
        chosenTimeFrame : null,
        suggestions     : {
          0 : {
            startDate : '2018-12-16',
            endDate   : '2018-12-23',
            voters    : [ 0 ],
            creator   : 0
          },
          1 : {
            startDate : '2018-12-16',
            endDate   : '2018-12-23',
            voters    : [ 1 ],
            creator   : 1
          },
          2 : {
            startDate : '2018-12-16',
            endDate   : '2018-12-23',
            voters    : [ 2 ],
            creator   : 2
          },
          3 : {
            startDate : '2018-12-16',
            endDate   : '2018-12-23',
            voters    : [ 3 ],
            creator   : 3
          },
          4 : {
            startDate : '2018-12-16',
            endDate   : '2018-12-23',
            voters    : [ 4 ],
            creator   : 4
          }
        }
      }
    }
  ],
  destinations : {
    cologne   : {
      name : 'Köln'
    },
    grenoble  : {
      name : 'Grenoble'
    },
    barcelona : {
      name : 'Barcelona'
    },
    saoPaulo  : {
      name : 'São Paulo'
    },
    zurich    : {
      name : 'Zurich'
    }
  }
};

const users = (users) => {
  let res = {};
  users.forEach(
    ({ firstName, lastName }, id) =>
      (res[id] = {
        id,
        firstName,
        lastName,
        email     : firstName.toLowerCase() + '@travelnuts.io'
      })
  );
  return res;
};

const trips = (trips) => {
  let res = {};
  trips.forEach(
    (trip, id) =>
      (res[id] = {
        id,
        ...trip
      })
  );
  return res;
};

module.exports = {
  users        : users(data.users),
  trips        : trips(data.trips),
  destinations : data.destinations
};
