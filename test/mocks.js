const data = {
  users        : [
    {
      firstName      : 'Damien',
      lastName       : 'Derail',
      availabilities : {
        0 : {
          startDate : '2018-12-16',
          endDate   : '2018-12-23'
        }
      }
    },
    {
      firstName      : 'Christopher',
      lastName       : 'Bücklein',
      availabilities : {
        0 : {
          startDate : '2018-12-18',
          endDate   : '2018-12-22'
        }
      }
    },
    {
      firstName      : 'Berta',
      lastName       : 'Cume',
      availabilities : {
        0 : {
          startDate : '2018-12-15',
          endDate   : '2018-12-30'
        }
      }
    },
    {
      firstName      : 'Arturo',
      lastName       : 'Moreira Santos',
      availabilities : {
        0 : {
          startDate : '2018-12-13',
          endDate   : '2018-12-23'
        }
      }
    },
    {
      firstName      : 'Marco',
      lastName       : 'Kunz',
      availabilities : {
        0 : {
          startDate : '2018-12-17',
          endDate   : '2018-12-22'
        }
      }
    }
  ],
  trips        : [
    {
      name         : 'Graduation Party',
      participants : [ 0, 1, 2, 3, 4 ],
      destination  : {
        suggestions : {
          grenoble : [ 0 ],
          cologne  : [ 1 ],
          barclona : [ 2 ],
          saoPaulo : [ 3 ],
          zurich   : [ 4 ]
        }
      },
      budget       : {
        suggestions : {
          500  : [ 0 ],
          600  : [ 1 ],
          700  : [ 2 ],
          1000 : [ 3 ],
          400  : [ 4 ]
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
  return users.map(({ firstName, lastName }, id) => ({
    id : {
      id,
      firstName,
      lastName,
      email     : firstName.toLowerCase() + '@travelnuts.io'
    }
  }));
};

const trips = (trips) => {
  return trips.map((trip, id) => ({
    id : {
      id,
      ...trip
    }
  }));
};

export default {
  users        : users(data.users),
  trips        : trips(data.trips),
  destinations : trips(data.destinations)
};
