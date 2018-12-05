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
          const { tripInfoChanged: updatedTrip } = await payload;
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
      const updatedTrip = addOrVoteForDestination(tripID, destinations, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addOrVoteForBudget: async (_, { tripID, budget }, { Trip, user }) => {
      const updatedTrip = addOrVoteForBudget(tripID, budget, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    addOrVoteForTimeFrame: async (_, { tripID, timeFrames }, { Trip, user }) => {
      const updatedTrip = addOrVoteForTimeFrame(tripID, timeFrames, user, { Trip });
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = removeVoteForDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = removeVoteForTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    removeVoteForBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = removeVoteForBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockDestination: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = lockDestination(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockTimeFrame: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = lockTimeFrame(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    lockBudget: async (_, { tripID, suggestionID }, { Trip, user }) => {
      const updatedTrip = lockBudget(tripID, suggestionID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockDestination: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = unlockDestination(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockTimeFrame: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = unlockTimeFrame(tripID, user, Trip);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },
    unlockBudget: async (_, { tripID }, { Trip, user }) => {
      const updatedTrip = unlockBudget(tripID, user, Trip);
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
  }
};
