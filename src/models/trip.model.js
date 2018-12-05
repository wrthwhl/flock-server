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
  createdAt: { type: Date, default: Date.now },
  destination: {
    isDictated: { type: Boolean, required: true, default: false },
    isLocked: { type: Boolean, default: false },
    chosenSuggestion: ObjectID,
    suggestions: { type: [ DestinationSchema ], required: true }
  },
  budget: {
    isDictated: { type: Boolean, required: true, default: false },
    isLocked: { type: Boolean, default: false },
    chosenSuggestion: ObjectID,
    suggestions: [ BudgetSchema ]
  },
  timeFrame: {
    isDictated: { type: Boolean, required: true, default: false },
    isLocked: { type: Boolean, default: false },
    chosenSuggestion: String,
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
      suggestions: [
        {
          _id: '000000000000000000000000',
          name: 'Barcelona',
          voters: [ '222222222222222222222222', '000000000000000000000000' ],
          creator: '222222222222222222222222'
        },
        {
          _id: '111111111111111111111111',
          name: 'Berlin',
          voters: [ '222222222222222222222222', '000000000000000000000000' ],
          creator: '000000000000000000000000'
        },
        {
          _id: '222222222222222222222222',
          name: 'Zurich',
          voters: [ '444444444444444444444444', '222222222222222222222222' ],
          creator: '444444444444444444444444'
        }
      ]
    },
    budget: {
      isDictated: false,
      suggestions: [
        {
          _id: '000000000000000000000000',
          value: 500,
          voters: [ '333333333333333333333333', '000000000000000000000000' ],
          creator: '333333333333333333333333'
        },
        {
          _id: '111111111111111111111111',
          value: 600,
          voters: [ '111111111111111111111111', '444444444444444444444444' ],
          creator: '111111111111111111111111'
        },
        {
          _id: '222222222222222222222222',
          value: 700,
          voters: [ '222222222222222222222222' ],
          creator: '222222222222222222222222'
        }
      ]
    },
    timeFrame: {
      isDictated: true,
      chosenSuggestion: '000000000000000000000000',
      suggestions: [
        {
          _id: '000000000000000000000000',
          startDate: '2018-12-16',
          endDate: '2018-12-23',
          voters: [ '111111111111111111111111', '444444444444444444444444' ],
          creator: '111111111111111111111111'
        },
        {
          _id: '111111111111111111111111',
          startDate: '2018-12-16',
          endDate: '2018-12-23',
          voters: [ '111111111111111111111111', '444444444444444444444444' ],
          creator: '444444444444444444444444'
        }
      ]
    }
  };
  await Trip.create(trip);
})();

export default Trip;
