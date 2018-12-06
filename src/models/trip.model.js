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

const MessageSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  creator: ObjectID,
  message: String,
  type: String
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
  },
  messages: [ MessageSchema ]
});

const Trip = mongoose.model('trips', TripSchema);

export default Trip;
