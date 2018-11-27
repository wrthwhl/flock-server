// 
// import mongoose, { Schema } from 'mongoose';
// import dataTrip from '../data';
//
// const DestinationSchema = new Schema({
//   id: Number,
//   name: String
// });
//
// const Destination = mongoose.model('destinations', DestinationSchema);
//
// (async function() {
//   await Destination.deleteMany({});
//   dataTrip.dest.forEach(async (destination) => {
//     await Destination.create(destination);
//   });
// })();
//
// export default Destination;
