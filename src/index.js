import apollo from './graphql/server';
import mongoose from './models';
import * as models from './models';
import config from '../config';

apollo.launch(models, config.apollo.playground, config.apollo.port, config.SECRET);

mongoose.launch(...config.mongoose);

export { mongoose, apollo };
