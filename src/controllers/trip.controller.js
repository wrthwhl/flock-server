import { buildSuggestionsObj } from './helpers';
import { PubSub, AuthenticationError } from 'apollo-server';
const pubsub = new PubSub();

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

  if (budget && budget.suggestions && budget.suggestions.length > 1)
    throw new Error('Multiple budget suggestions received, only one suggestion allowed.');

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
  let newTrip = await Trip.create({
    ...trip,
    participants,
    destination,
    budget,
    timeFrame
  });
  if (destination.isDictated || timeFrame.isDictated || budget.isDictated) {
    const update = {};
    if (destination.isDictated) update['destination.chosenSuggestion'] = newTrip.destination.suggestions[0]._id;
    if (timeFrame.isDictated) update['timeFrame.chosenSuggestion'] = newTrip.timeFrame.suggestions[0]._id;
    if (budget.isDictated) update['budget.chosenSuggestion'] = newTrip.budget.suggestions[0]._id;
    newTrip = await Trip.findOneAndUpdate({ _id: newTrip._id }, update, { new: true });
  }

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
  let updatedTrip = await Trip.findOneAndUpdate(
    {
      _id: tripID
    },
    {
      $pull: { 'budget.suggestions.$[].voters': user._id }
    },
    {
      new: true
    }
  );
  updatedTrip = await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'budget.suggestions.value': budget.value
    },
    {
      $addToSet: { 'budget.suggestions.$.voters': user._id }
    },
    {
      new: true
    }
  );
  if (!updatedTrip)
    updatedTrip = Trip.findOneAndUpdate({ _id: tripID }, { $push: { 'budget.suggestions': budget } }, { new: true });

  pubsub.publish('TRIPINFO_CHANGED', { tripInfoChanged: updatedTrip });
  return updatedTrip;
};

export const removeVoteForDestination = async (tripID, suggestionID, user, Trip) => {
  return await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'destination.suggestions._id': suggestionID
    },
    { $pull: { 'destination.suggestions.$.voters': user._id } },
    { new: true }
  );
};

export const removeVoteForTimeFrame = async (tripID, suggestionID, user, Trip) => {
  return await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'timeFrame.suggestions._id': suggestionID
    },
    { $pull: { 'timeFrame.suggestions.$.voters': user._id } },
    { new: true }
  );
};

export const removeVoteForBudget = async (tripID, suggestionID, user, Trip) => {
  const newTrip = await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'budget.suggestions._id': suggestionID
    },
    { $pull: { 'budget.suggestions.$.voters': user._id } },
    { new: true }
  );
  return newTrip;
};

const lockTripAspect = async (aspect, tripID, suggestionID, user, Trip) => {
  const trip = await Trip.findOne({ _id: tripID });
  const suggestionIDs = trip[aspect]['suggestions'].map((suggestion) => String(suggestion._id));
  if (!suggestionIDs.includes(String(suggestionID))) throw new Error('Suggestion with provided ID does not exist!');
  if (String(trip.creator) === String(user._id)) {
    return await Trip.findOneAndUpdate(
      { _id: tripID },
      {
        [aspect + '.chosenSuggestion']: suggestionID,
        [aspect + '.isLocked']: true
      },
      { new: true }
    );
  }
};

const unlockTripAspect = async (aspect, tripID, user, Trip) => {
  const trip = await Trip.findOne({ _id: tripID });
  if (String(trip.creator) === String(user._id)) {
    const update = { [aspect + '.isLocked']: false };
    if (!trip[aspect]['isDictated']) update[aspect + '.chosenSuggestion'] = null;
    return await Trip.findOneAndUpdate({ _id: tripID }, update, { new: true });
  }
};

export const lockDestination = (...args) => lockTripAspect('destination', ...args);
export const lockTimeFrame = (...args) => lockTripAspect('timeFrame', ...args);
export const lockBudget = (...args) => lockTripAspect('budget', ...args);

export const unlockDestination = (...args) => unlockTripAspect('destination', ...args);
export const unlockTimeFrame = (...args) => unlockTripAspect('timeFrame', ...args);
export const unlockBudget = (...args) => unlockTripAspect('budget', ...args);
