import merge from 'lodash.merge';

// Root types
import rootTypeDefs from './root.typeDefs.gql';
import rootResolvers from './root.resolvers';

import { typeDefs as DateType, resolvers as DateResolvers } from './Date';
import { typeDefs as User, resolvers as userResolvers } from './User';
import { typeDefs as Trip, resolvers as tripResolvers } from './Trip';

export default {
  // Apollo Server accepts an array of type definitions 👍
  typeDefs: [ rootTypeDefs, DateType, User, Trip ],
  // Since the resolvers are just objects, we can make do with a deep merge
  resolvers: merge(rootResolvers, DateResolvers, userResolvers, tripResolvers)
};
