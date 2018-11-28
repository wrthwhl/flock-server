
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectId;

const DestinationSchema = new Schema({
  name: String,
  voters: [ ObjectID ],
  creator: ObjectID
});

const BudgetSchema = new Schema({
  value: Number,
  voters: [ ObjectID ],
  creator: ObjectID
});

const TimeFrameSchema = new Schema({
  startDate: Date,
  endDate: Date,
  voters: [ ObjectID ],
  creator: ObjectID
});

const TripSchema = new Schema({
  name: { type: String, required: true },
  participants: { type: [ ObjectID ], required: true },
  creator: ObjectID,
  destination: {
    isDictated: { type: Boolean, required: true },
    chosenDestination: ObjectID,
    suggestions: { type: [ DestinationSchema ], required: true }
  },
  budget: {
    isDictated: Boolean,
    choosenBudget: ObjectID,
    suggestions: [ BudgetSchema ]
  },
  timeFrame: {
    isDictated: Boolean,
    chosenTimeFrame: String,
    suggestions: [ TimeFrameSchema ]
  }
});

const Trip = mongoose.model('trips', TripSchema);

(async function() {
  await Trip.deleteMany({});
  const trip = {
    _id: '000000000000000000000000',
    name: 'Graduation Trip',
    participants: [
      '000000000000000000000000',
      '111111111111111111111111',
      '222222222222222222222222',
      '333333333333333333333333',
      '444444444444444444444444'
    ],
    creator: '000000000000000000000000',
    destination: {
      isDictated: false,
      chosenDestination: '000000000000000000000000',
      suggestions: [
        {
          _id: '000000000000000000000000',
          name: 'Barcelona',
          voters: [ '222222222222222222222222', '000000000000000000000000' ],
          creator: '222222222222222222222222'
        }
      ]
    },
    budget: {
      isDictated: false,
      chosenDestination: null,
      suggestions: [
        {
          value: 500,
          voters: [ '333333333333333333333333', '444444444444444444444444' ],
          creator: '333333333333333333333333'
        }
      ]
    },
    timeFrame: {
      isDictated: true,
      chosenDestination: null,
      suggestions: [
        {
          startDate: '2018-12-16',
          endDate: '2018-12-23',
          voters: [ '111111111111111111111111', '444444444444444444444444' ],
          creator: '111111111111111111111111'
        }
      ]
    }
  };
  await Trip.create(trip);

})();

export default Trip;
