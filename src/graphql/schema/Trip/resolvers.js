import { users, voters, creator } from '../resolver-helpers';

export default {
  Query: {
    trip: (_, { id }, { Trip }) => Trip.findOne({ _id: id }),
    allTrips: (_, __, { Trip }) => Trip.find()
  },

  Mutation: {
    createTrip: async (_, { trip, userID }, { Trip, User }) => {
      const { destination, budget, timeFrame, participants } = trip;
      const matchedUsers = await User.find({ email: { $in: participants } });
      const matchedEmails = matchedUsers.map((user) => user.email);
      const newUsers = trip.participants.filter((email) => matchedEmails.indexOf(email) === -1);
      const createdUsers = await User.create(newUsers.map((email) => ({ email })));
      trip.participants = [ ...(matchedUsers || []), ...(createdUsers || []) ].map((user) => user.id);
      if (destination.suggestions && destination.suggestions.length) {
        destination.suggestions = destination.suggestions.map((name) => ({
          name,
          voters: [ userID ],
          creator: userID
        }));
      }
      if (budget.suggestions && budget.suggestions.length) {
        budget.suggestions = budget.suggestions.map((value) => ({
          value,
          voters: [ userID ],
          creator: userID
        }));
      }
      if (timeFrame.suggestions && timeFrame.suggestions.length) {
        timeFrame.suggestions = timeFrame.suggestions.map((object) => ({
          ...object,
          voters: [ userID ],
          creator: userID
        }));
      }
      trip['creator'] = userID;
      return Trip.create(trip);
    }
  },

  Trip: {
    participants: ({ participants }, _, { User }) => users(participants, User),
    creator
    // destination  : ({ id }, _, { Trip }) => Trip.findOne(id)
  },
  DestinationObject: {
    // suggestions       : ({ suggestions }, _, { Destination }) => suggestions
    chosenDestination: ({ chosenDestination, suggestions }) =>
      suggestions.find((destination) => String(chosenDestination) === String(destination._id)) || null
    // chosenDestination ? mergeProps(chosenDestination, Destination.getOne, suggestions) : null
  },
  Destination: {
    voters,
    creator
  },
  BudgetObject: {
    // suggestions  : ({ suggestions }) => suggestions,
    chosenBudget: ({ chosenBudget, suggestions }) =>
      chosenBudget || suggestions.find((budget) => chosenBudget === budget._id)
  },
  Budget: {
    voters,
    creator
  },
  TimeFrameObject: {
    // suggestions     : ({ suggestions }) => suggestions,
    chosenTimeFrame: ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame || suggestions.find((timeFrame) => chosenTimeFrame === timeFrame._id)
  },
  TimeFrame: {
    voters,
    creator
  }
};
