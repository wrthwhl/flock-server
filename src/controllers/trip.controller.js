import { buildSuggestionsObj } from './helpers';

export const addOrVoteForTimeFrame = async (tripID, timeFrames, user, Trip) => {
  timeFrames = buildSuggestionsObj(timeFrames, user._id);
  return timeFrames.map(async (timeFrame) => {
    let trip = await Trip.findOneAndUpdate(
      {
        _id: tripID,
        'timeFrame.suggestions.startDate': timeFrame.startDate,
        'timeFrame.suggestions.endDate': timeFrame.endDate
      },
      { $addToSet: { 'timeFrame.suggestions.$.voters': user._id } },
      { new: true }
    );
    if (!trip)
      trip = Trip.findOneAndUpdate({ _id: tripID }, { $push: { 'timeFrame.suggestions': timeFrame } }, { new: true });
    return trip;
  });
};
