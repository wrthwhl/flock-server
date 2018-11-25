// export { default as User } from './user.model';
import 'babel-polyfill';
import data from '../data';
import dataTrip from '../data';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(
  'mongodb://localhost/travelroo',
  { useNewUrlParser: true }
);
const db = mongoose.connection;

const UserSchema = new Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  avatar_url: String
});

const TripSchema = new Schema({
  name: String,
  participants: Array,
  destination: {
    chosenDestination: String,
    suggestions: { String: { voters: Array, creator: Number } }
  },
  budget: {
    choosenBudget: Number,
    suggestions: {
      Number: {
        voters: Array,
        creator: Number
      }
    }
  },
  timeFrame: {
    chosenTimeFrame: String,
    suggestions: {
      Number: {
        startDate: Date,
        endDate: Date,
        voters: Array,
        creator: Number
      }
    }
  }
});

const UserModel = mongoose.model('users', UserSchema);
const TripModel = mongoose.model('trips', TripSchema);

(async function() {
  await UserModel.deleteMany({});

  Object.keys(data).map(el => {
    if(el === 'users'){
      data[el].map(selectedUser => {
        const newUser = new UserModel({
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          avatar_url: selectedUser.avatar_url
        });
        newUser.save();
      });
    }
  });
})();

(async function() {
  await UserModel.deleteMany({});

  Object.keys(dataTrip).map(el => {
    if(el === 'trips'){
      dataTrip[el].map(selectedTrip => {

        const newTrip = new TripModel({
          name: selectedTrip.name,
          participants: selectedTrip.participants,
          destination: {
            chosenDestination: selectedTrip.destination.chosenDestination,
            suggestions: {
              voters: selectedTrip.destination.suggestions.voters,
              creator: selectedTrip.destination.suggestions.creator
            }
          },
          budget: {
            choosenBudget: selectedTrip.budget.choosenBudget,
            suggestions: {
              Number: {
                voters: selectedTrip.budget.suggestions.voters,
                creator: selectedTrip.budget.suggestions.creator
              }
            }
          },
          timeFrame: {
            chosenTimeFrame: selectedTrip.timeFrame.chosenTimeFrame,
            suggestions: {
              startDate: selectedTrip.timeFrame.suggestions.startDate,
              endDate: selectedTrip.timeFrame.suggestions.endDate,
              voters: selectedTrip.timeFrame.suggestions.voters,
              creator: selectedTrip.timeFrame.suggestions.creator
            }
          }
        });
        newTrip.save();
      });

    }
  });
})();

export default {
  getAll: () => {
    return db.users;
  },
  getById: args => {
    let id = args.id;

    return db.users.find(user => {
      return user.id === id;
    });
  },

  updateOne: (id, update) => Object.assign(db.users[id], update)
};
