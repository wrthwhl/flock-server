import dotenv from 'dotenv';
dotenv.config();
import apollo from './graphql/server';
import mongoose from './models';
import * as models from './models';

apollo.launch(models, process.env.PORT, process.env.AUTH_SECRET);

mongoose.launch(process.env.DB_URI);

export { mongoose, apollo };
