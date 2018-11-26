import { mergeProps, voters, creator } from '../resolver-helpers';

export default {
  Query             : {
    trip     : (_, { tripID }, { Trip }) => Trip.findOne(tripID),
    allTrips : (_, __, { Trip }) => Trip.find()
  },

  /* Mutation          : {
    updateTrip : (_, { input: { id, ...update } }, { Trip }) => Trip.updateOne(id, update)
  }, */

  Trip              : {
    participants : (_, __, { User }) => Object.values(User.getAll()),
    destination  : ({ id }, _, { Trip }) => Trip.getOne(id).destination
  },
  DestinationObject : {
    suggestions       : ({ suggestions }, _, { Destination }) =>
      Object.keys(suggestions).map((key) => mergeProps(key, Destination.getOne, suggestions)),
    chosenDestination : ({ chosenDestination, suggestions }, _, { Destination }) =>
      chosenDestination ? mergeProps(chosenDestination, Destination.getOne, suggestions) : null
  },
  Destination       : {
    voters,
    creator
  },
  BudgetObject      : {
    suggestions  : ({ suggestions }) => Object.keys(suggestions).map((value) => suggestions[value]),
    chosenBudget : ({ chosenBudget, suggestions }) =>
      chosenBudget ? { value: chosenBudget, ...suggestions[chosenBudget] } : null
  },
  Budget            : {
    voters,
    creator
  },
  TimeFrameObject   : {
    suggestions     : ({ suggestions }) => Object.keys(suggestions).map((value) => suggestions[value]),
    chosenTimeFrame : ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame ? { value: chosenTimeFrame, ...suggestions[chosenTimeFrame] } : null
  },
  TimeFrame         : {
    voters,
    creator
  }
};
