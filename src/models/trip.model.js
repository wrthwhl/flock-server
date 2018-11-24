import { trips } from '../../db';

export default {
  getAll    : () => Object.values(trips),
  getOne    : (id) => trips[id],
  updateOne : (id, update) => (trips[id] = { ...trips[id], ...update }),
  create    : (trip) => trip
};
