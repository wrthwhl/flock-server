import { destinations } from '../../db';

export default {
  getAll : () => Object.values(destinations),
  getOne : (key) => destinations[key]
};
