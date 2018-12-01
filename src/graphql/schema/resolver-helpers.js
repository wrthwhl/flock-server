import jwt from 'jsonwebtoken';
import config from '../../../config';

export const getJWT = (payload) => jwt.sign(payload, config.SECRET, { expiresIn: '185d' });

export const mergeProps = (key, ...objects) => ({
  key,
  ...objects.reduce((arr, obj) => ({ ...arr, ...(obj[key] || obj(key)) }), {})
});
export const users = (arrayOfUserIDs, User) => User.find({ _id: { $in: arrayOfUserIDs } });

export const voters = ({ voters }, _, { User }) => users(voters, User);

export const creator = ({ creator }, _, { User }) => User.findOne(creator);

export const buildSuggestionsObj = (suggestions, userID) => {
  if (suggestions.length) {
    suggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      voters: [ userID ],

      creator: userID
    }));
  }
  return suggestions;
};

export const findUserOrCreate = async (arrUsers, User) => {
  const matchedUsers = await User.find({ email: { $in: arrUsers } });
  const matchedEmails = matchedUsers.map((user) => user.email);
  const newUsers = arrUsers.filter((email) => matchedEmails.indexOf(email) === -1);
  const createdUsers = await User.create(newUsers.map((email) => ({ email })));
  return [ ...(matchedUsers || []), ...(createdUsers || []) ].map((user) => user.id);
};
