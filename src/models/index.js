import mongoose from 'mongoose';
export { default as User } from './user.model';
export { default as Trip } from './trip.model';

export default mongoose
  .connect('mongodb://localhost/travelroo', { useNewUrlParser: true })
  .then(() => console.log('✔️  Successfully connected to MongoDB!')) //eslint-disable-line no-console
  .catch((err) => console.error('❌  Could not connect to MongoDB!', err)); //eslint-disable-line no-console
