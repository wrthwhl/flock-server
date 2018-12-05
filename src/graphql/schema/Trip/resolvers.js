import { users, voters, creator, chosenSuggestion } from '../resolver-helpers';
import { PubSub, withFilter } from 'apollo-server';
import {
  createTrip,
  addParticipants,
  removeParticipants,
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
  writeDestinationMessage,
  leaveTrip
} from '../../../controllers/trip.controller';
const pubsub = new PubSub();

export default {
  Subscription: {
    tripInfoChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('TRIPINFO_CHANGED'),
        async (payload, { tripID }, { User, user: { email } }) => {
          const user = await User.findOne({ email });
          const { tripInfoChanged: updatedTrip } = payload;
          const participants = updatedTrip.participants.map((participant) => String(participant));
          return participants.includes(user._id.toString()) && (!tripID || String(tripID) === String(updatedTrip._id));
        }
      )
    },
    ownTripsChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('OWN_TRIPS_CHANGED'),
        async (payload, _, { user: { _id } }) => {
          const affectedUser = payload.affectedUser;
          return String(affectedUser) === String(_id);
        }
      )
    }
  },

  Query: {
    trip: (_, { id }, { Trip }) => Trip.findOne({ _id: id })
  },

  Mutation: {
    createTrip: async (_, { trip }, { Trip, User, user }) => {
      const { newTrip, affectedUsers } = await createTrip(trip, user, { Trip, User });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      affectedUsers.forEach(({ id, allTrips }) => {
        pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, affectedUser: id });
      });
      return newTrip;
    },
    addParticipants: async (_, { tripID, participants }, { User, Trip }) => {
      let { updatedTrip, affectedUsers } = await addParticipants(tripID, participants, { User, Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      affectedUsers.forEach(({ id, allTrips }) => {
        pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, affectedUser: id });
      });
      return updatedTrip;
    },
    removeParticipants: async (_, { tripID, participants }, { Trip, User }) => {
      const { updatedTrip, affectedUsers } = await removeParticipants(tripID, participants, User, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      affectedUsers.forEach(({ id, allTrips }) => {
        pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, affectedUser: id });
      });
      return updatedTrip;
    },
    addOrVoteForDestination: async (_, { tripID, destinations }, { Trip, user }) => {
      const updatedTrip = await addOrVoteForDestination(tripID, destinations, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addOrVoteForBudget: async (_, { tripID, budget }, { Trip, user }) => {
      const updatedTrip = await addOrVoteForBudget(tripID, budget, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addOrVoteForTimeFrame: async (_, { tripID, timeFrames }, { Trip, user }) => {
      const updatedTrip = await addOrVoteForTimeFrame(tripID, timeFrames, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await removeVoteForDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await removeVoteForTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await removeVoteForBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await lockDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await lockTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = await lockBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockDestination: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = await unlockDestination(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockTimeFrame: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = await unlockTimeFrame(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockBudget: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = await unlockBudget(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addGeneralMessage: async (_, { tripID, message }, { Trip, user }) => {
      const updatedTrip = await writeGeneralMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addBudgetMessage: async (_, { tripID, message }, { Trip, user }) => {
      const updatedTrip = await writeBudetMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addTimeFrameMessage: async (_, { tripID, message }, { Trip, user }) => {
      const updatedTrip = await writeTimeFrameMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addDestinationMessage: async (_, { tripID, message }, { Trip, user }) => {
      const updatedTrip = await writeDestinationMessage(tripID, message, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    toggleBudgetDictator: async (_, { tripID }, { Trip }) => {
      const updatedTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.budget.isDictated = !doc.budget.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    toggleDestinationDictator: async (_, { tripID }, { Trip }) => {
      const updatedTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.destination.isDictated = !doc.destination.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    toggleTimeFrameDictator: async (_, { tripID }, { Trip }) => {
      const updatedTrip = await Trip.findOne({ _id: tripID }, (err, doc) => {
        doc.timeFrame.isDictated = !doc.timeFrame.isDictated;
        doc.save();
      });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    leaveTrip: async (_, { tripID }, { Trip, user: { _id } }) => {
      const { updatedTrip, allTrips } = await leaveTrip(tripID, _id, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, affectedUser: _id });
      return allTrips;
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
