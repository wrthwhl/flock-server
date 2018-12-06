import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  avatar_url: String,
  password: String
});

const User = mongoose.model('users', UserSchema);

export default User;
