import config from '../config';
import apollo from './graphql/server';
import mongoose from './models';
import * as models from './models';

apollo.launch({ context: models, playground: config.apollo.playground }, config.apollo.PORT);

mongoose.launch(...config.mongoose);
