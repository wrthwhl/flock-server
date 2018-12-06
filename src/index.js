import dotenv from 'dotenv';
const config = dotenv.config();
if (config.error) throw new Error('Could not load .env file from root directory', config.error);
import apollo from './graphql/server';
import mongoose from './models';
import * as models from './models';

apollo.launch(models, process.env.PORT, process.env.AUTH_SECRET);

mongoose.launch(process.env.DB_URI);

export { mongoose, apollo };
