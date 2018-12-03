import { users, voters, creator } from '../resolver-helpers';
import { PubSub, withFilter } from 'apollo-server';
import { sendEmail } from '../../../controllers/email.controller';
import {
  createTrip,
  addParticipants,
  addOrVoteForDestination,
  addOrVoteForTimeFrame,
  addOrVoteForBudget,
  removeVoteForDestination,
  removeVoteForTimeFrame,
  removeVoteForBudget
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
          const participants = payloadResolved.participants.map(participant =>
            participant.toString()
          );
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
      sendEmail({ trip, user });

      return newTrip;
    },
    addParticipants: async (_, { tripID, participants }, ctx) => {
      const newTrip = addParticipants(tripID, participants, ctx);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForDestination: async (
      _,
      { tripID, destinations },
      { Trip, user }
    ) => {
      const newTrip = addOrVoteForDestination(tripID, destinations, user, {
        Trip
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForBudget: async (_, { tripID, budget }, { Trip, user }) => {
      const newTrip = addOrVoteForBudget(tripID, budget, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addOrVoteForTimeFrame: async (
      _,
      { tripID, timeFrames },
      { Trip, user }
    ) => {
      const newTrip = addOrVoteForTimeFrame(tripID, timeFrames, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    removeVoteForDestination: async (
      _,
      { tripID, destinationID },
      { Trip, user }
    ) => {
      const newTrip = removeVoteForDestination(
        tripID,
        destinationID,
        user,
        Trip
      );
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    removeVoteForTimeFrame: async (
      _,
      { tripID, timeFrameID },
      { Trip, user }
    ) => {
      const newTrip = removeVoteForTimeFrame(tripID, timeFrameID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    removeVoteForBudget: async (_, { tripID, budgetID }, { Trip, user }) => {
      const newTrip = removeVoteForBudget(tripID, budgetID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    }
  },

  Trip: {
    participants: ({ participants }, _, { User }) => users(participants, User),
    creator
  },
  DestinationObject: {
    chosenDestination: ({ chosenDestination, suggestions }) =>
      chosenDestination &&
      suggestions.find(
        destination => String(chosenDestination) === String(destination._id)
      )
  },
  Destination: {
    voters,
    creator
  },
  BudgetObject: {
    chosenBudget: ({ chosenBudget, suggestions }) =>
      chosenBudget &&
      suggestions.find(budget => String(chosenBudget) === String(budget._id))
  },
  Budget: {
    voters,
    creator
  },
  TimeFrameObject: {
    chosenTimeFrame: ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame &&
      suggestions.find(
        timeFrame => String(chosenTimeFrame) === String(timeFrame._id)
      )
  },
  TimeFrame: {
    voters,
    creator
  }
};
