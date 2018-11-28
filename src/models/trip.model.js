

import mongoose, { Schema } from 'mongoose';
const ObjectID = mongoose.Schema.Types.ObjectId;

const DestinationSchema = new Schema({
  name    : String,
  voters  : [ ObjectID ],
  creator : ObjectID
});

const BudgetSchema = new Schema({
  value   : Number,
  voters  : [ ObjectID ],
  creator : ObjectID
});

const TimeFrameSchema = new Schema({
  startDate : Date,
  endDate   : Date,
  voters    : [ ObjectID ],
  creator   : ObjectID
});

const TripSchema = new Schema({
  name         : { type: String, required: true },
  participants : { type: [ ObjectID ], required: true },
  destination  : {
    isDictated        : { type: Boolean, required: true },
    chosenDestination : ObjectID,
    suggestions       : { type: [ DestinationSchema ], required: true }
  },
  budget       : {
    isDictated    : Boolean,
    choosenBudget : ObjectID,
    suggestions   : [ BudgetSchema ]
  },
  timeFrame    : {
    isDictated      : Boolean,
    chosenTimeFrame : String,
    suggestions     : [ TimeFrameSchema ]
  }
});

const Trip = mongoose.model('trips', TripSchema);

// (async function() {
//   await Trip.deleteMany({});
//   await Trip.create({
//     name         : 'Graduation Trip',
//     participants : [
//       '5bfc4455e3833d7f2a7ff22b',
//       '5bfc4455e3833d7f2a7ff22a',
//       '5bfc4455e3833d7f2a7ff229',
//       '5bfc4455e3833d7f2a7ff228'
//     ],
//     destination  : {
//       isDictated        : false,
//       chosenDestination : null,
//       suggestions       : [
//         {
//           name    : 'Barcelona',
//           voters  : [ '5bfc4455e3833d7f2a7ff22b', '5bfc4455e3833d7f2a7ff22a' ],
//           creator : '5bfc4455e3833d7f2a7ff22b'
//         }
//       ]
//     },
//     budget       : {
//       isDictated        : false,
//       chosenBudget : null,
//       suggestions       : [
//         {
//           value   : 500,
//           voters  : [ '5bfc4455e3833d7f2a7ff22b', '5bfc4455e3833d7f2a7ff22a' ],
//           creator : '5bfc4455e3833d7f2a7ff22b'
//         }
//       ]
//     },
//     timeFrame    : {
//       isDictated        : true,
//       chosenTimeFrame : null,
//       suggestions       : [
//         {
//           startDate : '2018-12-16',
//           endDate   : '2018-12-23',
//           voters    : [ '5bfc4455e3833d7f2a7ff22b', '5bfc4455e3833d7f2a7ff22a' ],
//           creator   : '5bfc4455e3833d7f2a7ff22b'
//         }
//       ]
//     }
//   });
//   // const trips = await Trip.find();
// })();

export default Trip;
