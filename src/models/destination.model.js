import { destinations } from '../../mock-db';

export default {
  getAll : () => Object.values(destinations),
  getOne : (key) => destinations[key]
};
