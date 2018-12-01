import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  avatar_url: String,
  password: String
});

const User = mongoose.model('users', UserSchema);

/* // TODO remove
import { getUsers } from '../../seeds/seedFunctions';
const [ ...users ] = getUsers(10);
User.create(users); */

export default User;
