import { users, voters, creator } from '../resolver-helpers';

export default {
  Query             : {
    trip     : (_, { id }, { Trip }) => Trip.findOne(id),
    allTrips : (_, __, { Trip }) => Trip.find()
  },

  Mutation          : {
    updateTrip : (_, { input: { ...update } }, { Trip }) => Trip.findOneAndUpdate(update),
    createTrip : async (_, { input, userID }, { Trip }) => {
      input.destination.suggestions = input.destination.suggestions.map((name) => ({
        name,
        voters  : [ userID ],
        creator : userID
      }));
      input.budget.suggestions = input.budget.suggestions.map((value) => ({
        value,
        voters  : [ userID ],
        creator : userID
      }));
      input.timeFrame.suggestions = input.timeFrame.suggestions.map((object) => ({
        ...object,
        voters  : [ userID ],
        creator : userID
      }));
      const res = await Trip.create(input);

      return res;
    }
  },

  Trip              : {
    participants : ({ participants }, _, { User }) => users(participants, User)
    // destination  : ({ id }, _, { Trip }) => Trip.findOne(id)
  },
  DestinationObject : {
    // suggestions       : ({ suggestions }, _, { Destination }) => suggestions
    chosenDestination : ({ chosenDestination, suggestions }) =>
      suggestions.find((destination) => String(chosenDestination) === String(destination._id)) || null
    // chosenDestination ? mergeProps(chosenDestination, Destination.getOne, suggestions) : null
  },
  Destination       : {
    voters,
    creator
  },
  BudgetObject      : {
    // suggestions  : ({ suggestions }) => suggestions,
    chosenBudget : ({ chosenBudget, suggestions }) =>
      chosenBudget || suggestions.find((budget) => chosenBudget === budget._id)
  },
  Budget            : {
    voters,
    creator
  },
  TimeFrameObject   : {
    // suggestions     : ({ suggestions }) => suggestions,
    chosenTimeFrame : ({ chosenTimeFrame, suggestions }) =>
      chosenTimeFrame || suggestions.find((timeFrame) => chosenTimeFrame === timeFrame._id)
  },
  TimeFrame         : {
    voters,
    creator
  }
};
