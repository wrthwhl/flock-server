import { buildSuggestionsObj } from './helpers';
import { AuthenticationError } from 'apollo-server';

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

  const affectedUsers = await Promise.all(
    newTrip.participants.map(async (id) => {
      const allTrips = await Trip.find({ participants: id });
      return { id, allTrips };
    })
  );
  return { newTrip, affectedUsers };
};

export const addParticipants = async (tripID, participants, { User, Trip }) => {
  participants = await Promise.all(
    participants.map(async (email) => {
      const user = await User.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
      return user._id;
    })
  );

  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: tripID },
    {
      $addToSet: {
        participants: { $each: participants }
      }
    },
    { new: true }
  );
  if (!updatedTrip) throw new Error('Could not find this trip in our database.');
  const affectedUsers = await Promise.all(
    updatedTrip.participants.map(async (id) => {
      const allTrips = await Trip.find({ participants: id });
      return { id, allTrips };
    })
  );
  return { updatedTrip, affectedUsers };
};

export const removeParticipants = async (tripID, participants, User, Trip) => {
  participants = await User.find({ email: { $in: participants } });
  participants = participants.map((user) => String(user._id));
  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: tripID },
    { $pull: { participants: { $in: participants } } },
    { new: true }
  );
  if (!updatedTrip) throw new Error('Could not process request to remove Participant from trip.');
  const affectedUsers = await Promise.all(
    participants.map(async (id) => {
      const allTrips = await Trip.find({ participants: id });
      return { id, allTrips };
    })
  );
  return { updatedTrip, affectedUsers };
};

export const addOrVoteForDestination = async (tripID, destinations, user, { Trip }) => {
  destinations = buildSuggestionsObj(destinations, user._id);
  let updatedTrip;
  const promises = destinations.map(async (destination) => {
    updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: tripID,
        'destination.suggestions.name': destination.name
      },
      { $addToSet: { 'destination.suggestions.$.voters': user._id } },
      { new: true }
    );

    if (!updatedTrip) {
      updatedTrip = await Trip.findOneAndUpdate(
        {
          _id: tripID
        },
        { $push: { 'destination.suggestions': destination } },
        { new: true }
      );
    }
    return updatedTrip;
  });
  await Promise.all(promises);
  if (!updatedTrip) throw new Error('Could not find this trip in our database');
  return updatedTrip;
};

export const addOrVoteForTimeFrame = async (tripID, timeFrames, user, { Trip }) => {
  timeFrames = buildSuggestionsObj(timeFrames, user._id);
  let updatedTrip;
  const promises = await timeFrames.map(async (timeFrame) => {
    updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: tripID,
        'timeFrame.suggestions.startDate': timeFrame.startDate,
        'timeFrame.suggestions.endDate': timeFrame.endDate
      },
      { $addToSet: { 'timeFrame.suggestions.$.voters': user._id } },
      { new: true }
    );
    if (!updatedTrip)
      updatedTrip = await Trip.findOneAndUpdate(
        { _id: tripID },
        { $push: { 'timeFrame.suggestions': timeFrame } },
        { new: true }
      );
    return updatedTrip;
  });
  await Promise.all(promises);
  return updatedTrip;
};

export const addOrVoteForBudget = async (tripID, budget, user, { Trip }) => {
  budget = buildSuggestionsObj([ budget ], user._id)[0];
  let updatedTrip = await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'budget.suggestions.value': budget.value
    },
    { $addToSet: { 'budget.suggestions.$.voters': user._id } },
    { new: true }
  );
  if (!updatedTrip)
    updatedTrip = Trip.findOneAndUpdate({ _id: tripID }, { $push: { 'budget.suggestions': budget } }, { new: true });

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
  const updatedTrip = await Trip.findOneAndUpdate(
    {
      _id: tripID,
      'budget.suggestions._id': suggestionID
    },
    { $pull: { 'budget.suggestions.$.voters': user._id } },
    { new: true }
  );
  return updatedTrip;
};

const lockTripAspect = async (aspect, tripID, suggestionID, user, Trip) => {
  const trip = await Trip.findOne({ _id: user._id });
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
  const trip = await Trip.findOne({ _id: user._id });
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

export const leaveTrip = async (tripID, _id, Trip) => {
  const tripThatWillBeLeft = await Trip.findOne({ _id: tripID });
  if (!_id || !tripThatWillBeLeft) throw new Error('Could not process request for logged-in user to leave trip.');
  const newParticipants = tripThatWillBeLeft.participants.filter(
    (potentialLeaver) => potentialLeaver.toString() !== _id.toString()
  );
  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: tripID },
    { $set: { participants: newParticipants } },
    { new: true }
  );
  const allTrips = await Trip.find({ participants: _id });
  return { updatedTrip, allTrips };
};
