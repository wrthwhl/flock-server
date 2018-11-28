import { mergeProps, voters, creator } from '../resolver-helpers';


export default {
  Query             : {
    trip     : (_, { id }, { Trip }) => Trip.findOne(id),
    allTrips : (_, __, { Trip }) => Trip.find()
  },

  Mutation          : {
    updateTrip : (_, { input: { ...update } }, { Trip }) => Trip.findOneAndUpdate(update),
    createTrip : async (_, {input, userID}, { Trip }) => {
      input.destination.suggestions = input.destination.suggestions.map(name => ({
        name,
        voters: [userID],
        creator: userID
      }));
      input.budget.suggestions = input.budget.suggestions.map(value => ({
        value,
        voters: [userID],
        creator: userID
      }));
      input.timeFrame.suggestions = input.timeFrame.suggestions.map(object => ({
        ...object,
        voters: [userID],
        creator: userID
      }));
      const res = await Trip.create(
        input
      );
    
      return res;
    }
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
