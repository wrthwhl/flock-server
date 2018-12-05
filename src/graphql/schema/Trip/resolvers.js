import { users, voters, creator, chosenSuggestion } from '../resolver-helpers';
import { PubSub, withFilter } from 'apollo-server';
import {
  createTrip,
  addParticipants,
  addOrVoteForDestination,
  addOrVoteForTimeFrame,
  addOrVoteForBudget,
  removeVoteForDestination,
  removeVoteForTimeFrame,
  removeVoteForBudget,
  lockDestination,
  lockTimeFrame,
  lockBudget,
  unlockDestination,
  unlockTimeFrame,
  unlockBudget,
  writeBudetMessage,
  writeGeneralMessage,
  writeTimeFrameMessage,
  writeDestinationMessage
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
    },
    removeVoteForDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = removeVoteForDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    removeVoteForTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = removeVoteForTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    removeVoteForBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = removeVoteForBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    lockDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = lockDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    lockTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = lockTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    lockBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const newTrip = lockBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    unlockDestination: async (_, { tripID }, { Trip, user }) => {
      const newTrip = unlockDestination(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    unlockTimeFrame: async (_, { tripID }, { Trip, user }) => {
      const newTrip = unlockTimeFrame(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    unlockBudget: async (_, { tripID }, { Trip, user }) => {
      const newTrip = unlockBudget(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addGeneralMessage: async (_, { tripID, message }, { Trip, user }) => {
      const newTrip = await writeGeneralMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addBudgetMessage: async (_, { tripID, message }, { Trip, user }) => {
      const newTrip = await writeBudetMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addTimeFrameMessage: async (_, { tripID, message }, { Trip, user }) => {
      const newTrip = await writeTimeFrameMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    addDestinationMessage: async (_, { tripID, message }, { Trip, user }) => {
      const newTrip = await writeDestinationMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    toggleBudgetDictator: async (_, { tripID }, { Trip }) => {
      const newTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.budget.isDictated = !doc.budget.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    toggleDestinationDictator: async (_, { tripID }, { Trip }) => {
      const newTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.destination.isDictated = !doc.destination.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    },
    toggleTimeFrameDictator: async (_, { tripID }, { Trip }) => {
      const newTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.timeFrame.isDictated = !doc.timeFrame.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
    }
  },

  Trip: {
    participants: ({ participants }, _, { User }) => users(participants, User),
    creator
  },
  DestinationObject: {
    chosenSuggestion
  },
  Destination: {
    voters,
    creator
  },
  BudgetObject: {
    chosenSuggestion
  },
  Budget: {
    voters,
    creator
  },
  TimeFrameObject: {
    chosenSuggestion
  },
  TimeFrame: {
    voters,
    creator
  },
  MessageObject: {
    creator
  }
};
