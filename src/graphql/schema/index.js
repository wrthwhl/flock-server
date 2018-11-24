import merge from 'lodash.merge';

// Root types
import rootTypeDefs from './typeDefs.gql';
import rootResolvers from './resolvers';

// Entity types
import { typeDefs as User, resolvers as userResolvers } from '../entities/User';

export default {
  // Apollo Server accepts an array of type definitions 👍
  typeDefs: [rootTypeDefs, User],
  // Since the resolvers are just objects, we can make due with a deep merge
  resolvers: merge(rootResolvers, userResolvers)
};
