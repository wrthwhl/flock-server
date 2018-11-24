import merge from 'lodash.merge';

// Root types
import rootTypeDefs from './typeDefs.gql';
import rootResolvers from './resolvers';

// Entity types
import { typeDefs as User, resolvers as userResolvers } from '../entities/User';
import { typeDefs as Trip, resolvers as tripResolvers } from '../entities/Trip';

export default {
  // Apollo Server accepts an array of type definitions 👍
  typeDefs  : [ rootTypeDefs, User, Trip ],
  // Since the resolvers are just objects, we can make do with a deep merge
  resolvers : merge(rootResolvers, userResolvers, tripResolvers)
};
