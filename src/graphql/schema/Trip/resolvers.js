import {
  users,
  voters,
  creator,
  buildSuggestionsObj,
  findUserOrCreate
} from '../resolver-helpers';

export default {
  Query: {
    trip: (_, { id }, { Trip }) => Trip.findOne({ _id: id }),
    allTrips: (_, __, { Trip }) => Trip.find()
  },

  Mutation: {
    createTrip: async (_, { trip }, { Trip, User, authToken }) => {
      const {
        destination = { isDictated: false },
        budget = { isDictated: false },
        timeFrame = { isDictated: false },
        participants
      } = trip;

      trip.participants = await findUserOrCreate(participants, User);
      trip.participants = [...trip.participants, authToken];
      destination.suggestions = buildSuggestionsObj(destination, authToken);
      budget.suggestions = buildSuggestionsObj(budget, authToken);
      timeFrame.suggestions = buildSuggestionsObj(timeFrame, authToken);
      trip['creator'] = authToken;

      return Trip.create({
        ...trip,
        destination,
        budget,
        timeFrame
      });
    },
    addParticipant: async (_, { tripID, participants }, { Trip }) =>
      await Trip.findOneAndUpdate(
        { _id: tripID },
        { $addToSet: { participants: participants[0] } },
        { new: true }
      )
  },

  Trip: {
    participants: ({ participants }, _, { User }) => users(participants, User),
    creator
  },
  DestinationObject: {
    chosenDestination: ({ chosenDestination, suggestions }) =>
      suggestions.find(
        destination => String(chosenDestination) === String(destination._id)
      ) || null
  },
  Destination: {
    voters,
    creator
  },
  BudgetObject: {
    chosenBudget: ({ chosenBudget, suggestions }) =>
      chosenBudget || suggestions.find(budget => chosenBudget === budget._id)
  },
  Budget: {
    voters,
    creator
  },
  TimeFrameObject: {
    chosenTimeFrame: ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame ||
      suggestions.find(timeFrame => chosenTimeFrame === timeFrame._id)
  },
  TimeFrame: {
    voters,
    creator
  }
};
