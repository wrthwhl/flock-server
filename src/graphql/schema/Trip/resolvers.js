import { users, voters, creator, buildSuggestionsObj, findUserOrCreate } from '../resolver-helpers';
import { AuthenticationError, PubSub, withFilter } from 'apollo-server';
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
          const user = await User.findOne({ email });
          console.log('////// PAYLOAD', payload.userLeftTrip);
          return payload._id === user._id.toString();
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
      trip.participants = [ user._id, ...trip.participants ];
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

      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
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
      const newTrip = Trip.findOneAndUpdate(...participant);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
      return newTrip;
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
      const updatedTrip = Trip.findOneAndUpdate(...addSuggestion);
      pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
      return updatedTrip;
    },

    leaveTrip: async (_, { tripID }, { Trip, User, user: { email } }) => {
      const userThatLeavesTrip = await User.findOne({ email });
      console.log('///// USERLEAVESTRIP', userThatLeavesTrip);
      const tripThatWillBeLeft = await Trip.findOne({ _id: tripID });
      const newParticipants = tripThatWillBeLeft.participants.filter(
        (potentialLeaver) =>
          console.log(potentialLeaver, userThatLeavesTrip._id.toString()) ||
          potentialLeaver._id.toString() !== userThatLeavesTrip._id.toString()
      );
      console.log('////// TRIPWILLBELEFT', newParticipants);
      await Trip.findeOneAndUpdate({ _id: tripID }, { participants: newParticipants }, { new: true });
      const allTrips = await Trip.find({ participants: userThatLeavesTrip._id });
      console.log('///// ALLTRIPS', allTrips);
      pubsub.publish('OWN_TRIPS_CHANGED', { ownTripsChanged: allTrips });
      return allTrips;
    },

    removeParticipants: () => {}
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
