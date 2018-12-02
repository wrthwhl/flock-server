import { users, voters, creator } from '../resolver-helpers';
import { PubSub, withFilter } from 'apollo-server';
import {
  createTrip,
  addParticipants,
  addOrVoteForDestination,
  addOrVoteForTimeFrame,
  addOrVoteForBudget
} from '../../../controllers/trip.controller';
const pubsub = new PubSub();

export default {
  Subscription: {
    tripInfoChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('TRIPINFO_CHANGED'),
        async (payload, _, { User, user: { email } }) => {
          const user = await User.findOne({ email });
          const payloadResolved = await payload.tripInfoChanged;
          const participants = payloadResolved.participants.map((participant) => participant.toString());
          return participants.includes(user._id.toString());
        }
      )
    }
  },

  Query: {
    trip: (_, { id }, { Trip }) => Trip.findOne({ _id: id }),
    allTrips: (_, __, { Trip }) => Trip.find()
  },

  Mutation: {
    createTrip: async (_, { trip }, { Trip, User, user }) => {
      const newTrip = createTrip(trip, user, { Trip, User });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addParticipants: async (_, { tripID, participants }, ctx) => {
      const newTrip = addParticipants(tripID, participants, ctx);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForDestination: async (_, { tripID, destinations }, { Trip, user }) => {
      const newTrip = addOrVoteForDestination(tripID, destinations, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForBudget: async (_, { tripID, budget }, { Trip, user }) => {
      const newTrip = addOrVoteForBudget(tripID, budget, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForTimeFrame: async (_, { tripID, timeFrames }, { Trip, user }) => {
      const newTrip = addOrVoteForTimeFrame(tripID, timeFrames, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    }

    /*  addVoterDestination: async (_, { tripID, destinationID }, { Trip, User, user: { email } }) => {
      const user = await User.findOne({ email });
      if (!user._id) throw new AuthenticationError('No valid user found based on authorization token provided.');
      return await Trip.findOneAndUpdate(
        { _id: tripID, 'destination.suggestions._id': destinationID },
        {
          $addToSet: { 'destination.suggestions.$.voters': user._id }
        },
        { new: true }
      );
    }, */
    /* removeVoterDestination: async (_, { tripID, destinationID }, { Trip, User, user: { email } }) => {
      const user = await User.findOne({ email });
      if (!user._id) throw new AuthenticationError('No valid user found based on authorization token provided.');
      return await Trip.findOneAndUpdate(
        { _id: tripID, 'destination.suggestions._id': destinationID },
        {
          $pull: { 'destination.suggestions.$.voters': user._id }
        },
        { new: true }
      );
    } */
    /* addBudget: (_, { tripID, budget }, { Trip }) => {
      let suggestion = budget.suggestions;
      let addBudgetSuggestion = [
        { _id: tripID },
        {
          $addToSet: {
            'budget.suggestions': { $each: suggestion }
          }
        },
        { new: true }
      ];

      return Trip.findOneAndUpdate(...addBudgetSuggestion);
    }, */
    /* addTimeFrame: (_, { tripID, timeFrame }, { Trip }) => {
      let suggestion = timeFrame.suggestions;
      let addTimeFrameSuggestion = [
        { _id: tripID },
        {
          $addToSet: {
            'timeFrame.suggestions': { $each: suggestion }
          }
        },
        { new: true }
      ];
      return Trip.findOneAndUpdate(...addTimeFrameSuggestion);
    }, */
    /* addVoterBudget: async (_, { tripID, budgetID }, { Trip, User, user: { email } }) => {
      const user = await User.findOne({ email });
      if (!user._id) throw new AuthenticationError('No valid user found based on authorization token provided.');
      return await Trip.findOneAndUpdate(
        { _id: tripID, 'budget.suggestions._id': budgetID },
        {
          $addToSet: { 'budget.suggestions.$.voters': user._id }
        },
        { new: true }
      );
    }, */
    /* removeVoterBudget: async (_, { tripID, budgetID }, { Trip, User, user: { email } }) => {
      const user = await User.findOne({ email });
      if (!user._id) throw new AuthenticationError('No valid user found based on authorization token provided.');
      return await Trip.findOneAndUpdate(
        { _id: tripID, 'budget.suggestions._id': budgetID },
        {
          $pull: { 'budget.suggestions.$.voters': user._id }
        },
        { new: true }
      );
    } */
    // const updatedTrip = Trip.findOneAndUpdate(...addSuggestion);
    // pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
    // return updatedTrip;
  },

  Trip: {
    participants: ({ participants }, _, { User }) => users(participants, User),
    creator
  },
  DestinationObject: {
    chosenDestination: ({ chosenDestination, suggestions }) =>
      suggestions.find((destination) => String(chosenDestination) === String(destination._id)) || null
  },
  Destination: {
    voters,
    creator
  },
  BudgetObject: {
    chosenBudget: ({ chosenBudget, suggestions }) =>
      chosenBudget || suggestions.find((budget) => chosenBudget === budget._id)
  },
  Budget: {
    voters,
    creator
  },
  TimeFrameObject: {
    chosenTimeFrame: ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame || suggestions.find((timeFrame) => chosenTimeFrame === timeFrame._id)
  },
  TimeFrame: {
    voters,
    creator
  }
};
