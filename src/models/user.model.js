import { users } from '../../db';

export default {
  getAll : () => Object.values(users),
  getOne : (id) => users[id]
};
