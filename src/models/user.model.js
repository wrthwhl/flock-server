import mongoose, { Schema } from 'mongoose';
import data from '../data';

const UserSchema = new Schema({
  id         : Number,
  firstName  : String,
  lastName   : String,
  email      : String,
  avatar_url : String
});

const User = mongoose.model('users', UserSchema);

(async function() {
  await User.deleteMany({});
  data.users.forEach(async (user) => {
    await User.create(user);
  });
})();

export default User;

// import db from './index';
// import UserModel from './index';

// export default {
//   getAll: () => {
//     return data.users;
//   },
//   getById: id => data.users[id],
//   updateOne: (id, update) => Object.assign(data.users[id], update)
// };
// export default {
//   getAll: () => {
//     console.log(db.find());// eslint-disable-line no-console
//     return db.users.find();
//   },
//   getById: args => {
//     let id = args.id;
//
//     return db.users.find(user => {
//       return user.id === id;
//     });
//   },
//
//   updateOne: (id, update) => Object.assign(db.users[id], update)
// };
