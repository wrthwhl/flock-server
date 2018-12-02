import { buildSuggestionsObj } from './helpers';
import { PubSub, AuthenticationError } from 'apollo-server';
const pubsub = new PubSub();

// !TODO DO NOT RETURN TOKEN IF REGISTERING WITH EXISTING EMAIL ADRESS BUT WRONG PASSWORD
// TODO check timeframe input: startDate < endDate
// TODO check if userid is valid/exists before writing it

export const createTrip = async (trip, user, { Trip, User }) => {
  if (!user) throw new AuthenticationError();
  const {
    destination = { isDictated: false },
    budget = { isDictated: false },
    timeFrame = { isDictated: false }
  } = trip;
  let { participants } = trip;

  participants = await Promise.all(
    participants.map(async (email) => {
      const user = await User.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
      return user._id;
    })
  );

  participants = [ ...new Set([ user._id, ...participants ]) ];
  destination.suggestions = buildSuggestionsObj(destination.suggestions, user._id);
  budget.suggestions = buildSuggestionsObj(budget.suggestions, user._id);
  timeFrame.suggestions = buildSuggestionsObj(timeFrame.suggestions, user._id);
  trip['creator'] = user._id;
  const newTrip = Trip.create({
    ...trip,
    participants,
    destination,
    budget,
    timeFrame
  });
  pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
  return newTrip;
};

export const addParticipants = async (tripID, participants, { User, Trip }) => {
  participants = await Promise.all(
    participants.map(async (email) => {
      const user = await User.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
      return user._id;
    })
  );

  const newTrip = Trip.findOneAndUpdate(
    { _id: tripID },
    {
      $addToSet: {
        participants: { $each: participants }
      }
    },
    { new: true }
  );
  if (!newTrip) throw new Error('Could not find this trip in our database');
  return newTrip;
};

export const addOrVoteForDestination = async (tripID, destinations, user, { Trip }) => {
  destinations = buildSuggestionsObj(destinations, user._id);
  let newTrip;
  const promises = destinations.map(async (destination) => {
    newTrip = await Trip.findOneAndUpdate(
      {
        _id: tripID,
        'destination.suggestions.name': destination.name
      },
      { $addToSet: { 'destination.suggestions.$.voters': user._id } },
      { new: true }
    );

    if (!newTrip) {
      newTrip = await Trip.findOneAndUpdate(
        {
          _id: tripID
        },
        { $push: { 'destination.suggestions': destination } },
        { new: true }
      );
    }
    return newTrip;
  });
  await Promise.all(promises);
  if (!newTrip) throw new Error('Could not find this trip in our database');
  return newTrip;
};

export const addOrVoteForTimeFrame = async (tripID, timeFrames, user, { Trip }) => {
  timeFrames = buildSuggestionsObj(timeFrames, user._id);
  let newTrip;
  const promises = await timeFrames.map(async (timeFrame) => {
    newTrip = await Trip.findOneAndUpdate(
      {
        _id: tripID,
        'timeFrame.suggestions.startDate': timeFrame.startDate,
        'timeFrame.suggestions.endDate': timeFrame.endDate
      },
      { $addToSet: { 'timeFrame.suggestions.$.voters': user._id } },
      { new: true }
    );
    if (!newTrip)
      newTrip = await Trip.findOneAndUpdate(
        { _id: tripID },
        { $push: { 'timeFrame.suggestions': timeFrame } },
        { new: true }
      );
    return newTrip;
  });
  await Promise.all(promises);
  pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: newTrip });
  return newTrip;
};

export const addOrVoteForBudget = async (tripID, budget, user, { Trip }) => {
  budget = buildSuggestionsObj([ budget ], user._id)[0];
  let trip = await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'budget.suggestions.value': budget.value
    },
    { $addToSet: { 'budget.suggestions.$.voters': user._id } },
    { new: true }
  );
  if (!trip) trip = Trip.findOneAndUpdate({ _id: tripID }, { $push: { 'budget.suggestions': budget } }, { new: true });

  pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: trip });
  return trip;
};
