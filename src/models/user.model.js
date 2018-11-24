import { users } from '../../mock-db';

export default {
  getAll : () => Object.values(users),
  getOne : (id) => users[id]
};
