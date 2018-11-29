import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

const SECRET = 'SECRET'; // TODO put in config and inject into resolver context

export default {
  Query: {
    self: (_, __, { User, authToken }) => User.findOne({ _id: authToken }),
    user: (_, { email }, { User }) => User.findOne({ email }), // TODO remove? cause: replaced by self
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    update: (_, { id, update }, { User }) => User.findOneAndUpdate({ _id: id }, update),
    register: async (_, { email, password, user }, { User }) => {
      password = await bcrypt.hash(password, 12);
      return User.create({ email, password, ...user });
    },
    login: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      let valid = false;
      if (user) {
        valid = bcrypt.compare(password, user.password);
      }
      if (!user || !valid) throw new AuthenticationError('');
      return jwt.sign({ email: user.email }, SECRET, { expiresIn: '185d' });
    },

    // TODO remove v, cause: deprecated
    createUser: (_, { input: { firstName, lastName, email, avatar_url } }, { User }) =>
      User.create({
        firstName,
        lastName,
        email,
        avatar_url
      })
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }
};
