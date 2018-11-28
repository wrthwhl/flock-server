import apollo from './graphql/server';
import mongoose from './models';
import * as models from './models';
import config from '../config';

apollo.launch({ context: models, playground: config.apollo.playground }, config.apollo.PORT);

mongoose.launch(...config.mongoose);

export { mongoose, apollo };
