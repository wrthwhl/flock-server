import mongoose, { User } from '../src/models';
import config from '../config';

import { getUsers } from './seedFunctions';

module.exports = {
  usersOnly : async () => {
    mongoose.launch(...config.mongoose);
    const [ ...users ] = getUsers(3);
    const a = User.create(users);
    console.log('a', a);
    // mongoose.close();
    return true;
  },
  destroy   : () => {}
};

// to call from shell: node -e "require('./seeds/scenes.js').usersOnly.create()"
