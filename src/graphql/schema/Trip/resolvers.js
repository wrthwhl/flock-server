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
  unlockBudget
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
    },
    ownTripsChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('OWN_TRIPS_CHANGED'),
        async (payload, _, { User, user: { email } }) => {
          console.log(await payload.userThatLeavesTrip);
          const user = await User.findOne({ email });
          const userThatLeavesTrip = await payload.userThatLeavesTrip;
          return userThatLeavesTrip._id.toString() === user._id.toString();
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
    leaveTrip: async (_, { tripID }, { Trip, User, user: { email } }) => {
      const userThatLeavesTrip = await User.findOne({ email });
      const tripThatWillBeLeft = await Trip.findOne({ _id: tripID });
      if (userThatLeavesTrip && tripThatWillBeLeft) {
        const newParticipants = tripThatWillBeLeft.participants.filter(
          (potentialLeaver) => potentialLeaver.toString() !== userThatLeavesTrip._id.toString()
        );
        await Trip.findOneAndUpdate({ _id: tripID }, { $set: { participants: newParticipants } }, { new: true });
      }
      const allTrips = await Trip.find({ participants: userThatLeavesTrip._id });
      pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, userThatLeavesTrip });
      return allTrips;
    },
    removeParticipant: async (_, { tripID, participant }, { Trip, User, user: { email } }) => {
      const userToRemove = await User.findOne({ email: participant });
      const userThatDeletes = await User.findOne({ email });
      const tripToDeleteParticipant = await Trip.findOne({ _id: tripID });
      if (
        userThatDeletes &&
        userToRemove &&
        tripToDeleteParticipant &&
        userThatDeletes._id.toString() === tripToDeleteParticipant.creator.toString()
      ) {
        const newParticipants = tripToDeleteParticipant.participants.filter(
          (parForCheck) => parForCheck.toString() !== userToRemove._id.toString()
        );
        const updatedTrip = await Trip.findOneAndUpdate(
          { _id: tripID },
          { participants: newParticipants },
          { new: true }
        );
        pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
        const allTrips = await Trip.find({ participants: userToRemove._id });
        pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips, userThatLeavesTrip: userToRemove });
        return updatedTrip;
      }
      return tripToDeleteParticipant;
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
