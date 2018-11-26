// export { default as User } from './user.model';
// export { default as Trip } from './trip.model';
// export { default as Destination } from './destination.model';

/////////////////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// export { default as User } from './user.model';
import data from '../data';
import dataTrip from '../data';

mongoose.connect('mongodb://localhost/travelroo', { useNewUrlParser: true });
// const db = mongoose.connection;

const UserSchema = new Schema({
  id         : Number,
  firstName  : String,
  lastName   : String,
  email      : String,
  avatar_url : String
});

const TripSchema = new Schema({
  name         : String,
  participants : Array,
  destination  : {
    chosenDestination : String,
    suggestions       : {
      String : {
        voters  : Array,
        creator : Number
      }
    }
  },
  budget       : {
    choosenBudget : Number,
    suggestions   : {
      Number : {
        voters  : Array,
        creator : Number
      }
    }
  },
  timeFrame    : {
    chosenTimeFrame : String,
    suggestions     : {
      Number : {
        startDate : Date,
        endDate   : Date,
        voters    : Array,
        creator   : Number
      }
    }
  }
});

const UserModel = mongoose.model('users', UserSchema);
const TripModel = mongoose.model('trips', TripSchema);

(async function() {
  await UserModel.deleteMany({});
  data.users.forEach(async (user) => {
    await UserModel.create(user);
  });
})();

(async function() {
  await TripModel.deleteMany({});
  dataTrip.trips.forEach(async (trip) => {
    await TripModel.create(trip);
  });
})();

export const User = {
  //db,
  getAll : () => {
    return UserModel.find();
  }
};
