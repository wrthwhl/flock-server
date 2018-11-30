import bcrypt from 'bcrypt';
import { getJWT } from '../resolver-helpers';
import { AuthenticationError } from 'apollo-server';

export default {
  Query: {
    self: (_, __, { User, user: { email } }) => User.findOne({ email }),
    allUsers: (_, __, { User }) => User.find()
  },

  Mutation: {
    updateUser: (_, { id, update }, { User }) =>
      User.findOneAndUpdate({ _id: id }, update),
    register: async (_, { email, password, user }, { User }) => {
      password = await bcrypt.hash(password, 12);
      try {
        await User.findOneAndUpdate(
          { email },
          { email, password, ...user },
          { upsert: true }
        );
      } catch (err) {
        throw new Error('Couldn\'t create user');
      }
      return getJWT({ email });
    },
    login: async (_, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      let valid = false;
      if (user) {
        valid = true === (await bcrypt.compare(password, user.password));
      }
      if (
        process.env.ENV.toLowerCase().includes('dev') &&
        password === 'YouFlock!'
      )
        valid = true; // TODO remove PASSEPARTOUT
      if (!user || !valid) throw new AuthenticationError();
      return await getJWT({ email: user.email });
    }
  },

  User: {
    trips: ({ id }, _, { Trip }) => Trip.find({ participants: id })
  }
};
