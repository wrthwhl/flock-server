import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

const SECRET = 'SECRET'; // TODO put in config and inject into resolver context

export default {
  Query: {
    self: (_, __, { User, user: { email } }) => User.findOne({ email }),
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    updateUser: (_, { id, update }, { User }) => User.findOneAndUpdate({ _id: id }, update),
    register: async (_, { email, password, user }, { User }) => {
      password = await bcrypt.hash(password, 12);
      return User.create({ email, password, ...user });
    },
    login: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      let valid = false;
      if (user) {
        valid = await bcrypt.compare(password, user.password);
      }
      if (!user || !valid) throw new AuthenticationError('');
      return jwt.sign({ email: user.email }, SECRET, { expiresIn: '185d' });
    }
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }
};
