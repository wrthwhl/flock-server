import data from '../data';

export default {
  getAll: () => {
    return data.users;
  },
  getById: id => data[id],
  updateOne: (id, update) => Object.assign(data[id], update)
};
