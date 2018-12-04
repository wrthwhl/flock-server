describe('schema', () => {
  test('has valid type definitions', async () => {});
});

describe('destination', () => {
  test('it should return the destination name', async () => {
    expect(trip.name).toEqual('My beautiful trip');
  });
  test('it should return the trip when we call the trip with id', async () => {
    expect(trip.id).toEqual('123456789');
  });
  test('it should find the user.id of the participant in an array', async () => {
    expect(trip.participants[0]).toContain('000000000000000000000000');
  });
});

const trip = {
  id: '123456789',
  name: 'My beautiful trip',
  participants: ['000000000000000000000000', '333333333333333333333333'],
  creator: '222222222222222222222222',
  destination: {
    isDictated: false,
    suggestions: [
      {
        voters: ['222222222222222222222222', '000000000000000000000000'],
        _id: '000000000000000000000000',
        name: 'Barcelona',
        creator: '222222222222222222222222'
      }
    ]
  },
  budget: {
    isDictated: false,
    suggestions: [
      {
        voters: ['333333333333333333333333', '444444444444444444444444'],
        _id: '000000000000000000000000',
        value: 500,
        creator: '333333333333333333333333'
      }
    ]
  },

  timeFrame: {
    isDictated: true,
    chosenTimeFrame: '000000000000000000000000',
    suggestions: [
      {
        voters: ['111111111111111111111111', '444444444444444444444444'],
        _id: '000000000000000000000000',
        startDate: '2018-12-16T00:00:00Z',
        endDate: '2018-12-23T00:00:00Z',
        creator: '111111111111111111111111'
      },
      {
        voters: ['111111111111111111111111', '444444444444444444444444'],
        _id: '111111111111111111111111',
        startDate: '2018-12-16T00:00:00Z',
        endDate: '2018-12-23T00:00:00Z',
        creator: '444444444444444444444444'
      }
    ]
  },
  createdAt: '2018-12-04T13:09:20.493Z'
};
