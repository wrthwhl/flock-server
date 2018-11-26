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
