import { users } from '../../mock-db';

export default {
  getAll : () => Object.values(users),
  getOne : (id) => users[id]
};

// import db from './index';
// import UserModel from './index';

// export default {
//   getAll: () => {
//     return data.users;
//   },
//   getById: id => data.users[id],
//   updateOne: (id, update) => Object.assign(data.users[id], update)
// };
// export default {
//   getAll: () => {
//     console.log(db.find());// eslint-disable-line no-console
//     return db.users.find();
//   },
//   getById: args => {
//     let id = args.id;
//
//     return db.users.find(user => {
//       return user.id === id;
//     });
//   },
//
//   updateOne: (id, update) => Object.assign(db.users[id], update)
// };
