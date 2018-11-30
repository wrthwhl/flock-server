import {
  users,
  voters,
  creator,
  buildSuggestionsObj,
  findUserOrCreate
} from '../resolver-helpers';
import { AuthenticationError } from 'apollo-server';
import { withFilter } from 'apollo-server';
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

export default {
  Subscription: {
    tripAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('TRIP_ADDED'),
        async (payload, variables) => {
          const payloadResolved = await payload.tripAdded;
          return (
            (await payloadResolved.creator.toString()) === variables.tripCreator
          );
        }
      )
    }
  },

  Query: {
    trip: (_, { id }, { Trip }) => Trip.findOne({ _id: id }),
    allTrips: (_, __, { Trip }) => Trip.find()
  },

  Mutation: {
    createTrip: async (_, { trip }, { Trip, User, user: { email } }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError();
      const {
        destination = { isDictated: false },
        budget = { isDictated: false },
        timeFrame = { isDictated: false },
        participants
      } = trip;

      trip.participants = await findUserOrCreate(participants, User);
      trip.participants = [user._id, ...trip.participants];
      destination.suggestions = buildSuggestionsObj(destination, user._id);
      budget.suggestions = buildSuggestionsObj(budget, user._id);
      timeFrame.suggestions = buildSuggestionsObj(timeFrame, user._id);
      trip['creator'] = user._id;
      const newTrip = Trip.create({
        ...trip,
        destination,
        budget,
        timeFrame
      });

      pubsub.publish('TRIP_ADDED', { tripAdded: newTrip });
      return newTrip;
    },
    addParticipant: async (_, { tripID, participants }, { Trip, User }) => {
      participants = await findUserOrCreate(participants, User);
      const participant = [
        { _id: tripID },
        {
          $addToSet: {
            participants: { $each: participants }
          }
        },
        { new: true }
      ];
      return Trip.findOneAndUpdate(...participant);
    },
    addDestination: (_, { tripID, destination }, { Trip }) => {
      let suggestion = destination.suggestions;
      let addSuggestion = [
        { _id: tripID },
        {
          $addToSet: {
            'destination.suggestions': { $each: suggestion }
          }
        },
        { new: true }
      ];
      return Trip.findOneAndUpdate(...addSuggestion);
    }
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
