import data from '../data';

export default {
  getAll: () => {
    return data.users;
  },
  getById: id => data.users[id],
  updateOne: (id, update) => Object.assign(data.users[id], update)
};
