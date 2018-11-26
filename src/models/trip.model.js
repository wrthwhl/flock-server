import mongoose, { Schema } from 'mongoose';
import data from '../data';

const TripSchema = new Schema({
  name         : String,
  participants : Array,
  destination  : {
    chosenDestination : String,
    suggestions       : {
      String : {
        voters  : [Number],
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

const Trip = mongoose.model('trips', TripSchema);

(async function() {
  await Trip.deleteMany({});
  data.trips.forEach(async (trip) => {
    await Trip.create(trip);
  });
})();

export default Trip;
