import mongoose from 'mongoose';
export { default as User } from './user.model';
export { default as Trip } from './trip.model';

export default {
  launch: (uri) => {
    mongoose
      .connect(uri, { useNewUrlParser: true })
      .then(() => console.log('✔️  Successfully connected to MongoDB!')) //eslint-disable-line no-console
      .catch((err) => console.error('❌  Could not connect to MongoDB!', err)); //eslint-disable-line no-console
  },
  close: () => {
    mongoose.connection
      .close()
      .then(() => console.log('✔️  Successfully disconnected from MongoDB!')) //eslint-disable-line no-console
      .catch((err) => console.error('❌  Could not disconnect to MongoDB!', err)); //eslint-disable-line no-console
  }
};
