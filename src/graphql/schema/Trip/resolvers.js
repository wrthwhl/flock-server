import { mergeProps, voters, creator } from '../resolver-helpers';

export default {
  Query             : {
    // trip     : (_, { tripID }, { Trip }) => Trip.findOne(tripID),
    trip     : (_, { id }, { Trip }) => Trip.findOne(id),
    allTrips : (_, __, { Trip }) => Trip.find()
  },

  Mutation          : {
    updateTrip : (_, { input: { ...update } }, { Trip }) => Trip.findOneAndUpdate(update)
  },

  Trip              : {
    participants : (_, __, { User }) => Object.values(User.find()),
    destination  : ({ id }, _, { Trip }) => Trip.findOne(id).destination
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
