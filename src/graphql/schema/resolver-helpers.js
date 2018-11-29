export const mergeProps = (key, ...objects) => ({
  key,
  ...objects.reduce((arr, obj) => ({ ...arr, ...(obj[key] || obj(key)) }), {})
});
export const users = (arrayOfUserIDs, User) => User.find({ _id: { $in: arrayOfUserIDs } });

export const voters = ({ voters }, _, { User }) => users(voters, User);

export const creator = ({ creator }, _, { User }) => User.findOne(creator);

export const buildSuggestionsObj = (dimension, authToken) => {
  if (dimension.suggestions && dimension.suggestions.length) {
    dimension.suggestions = dimension.suggestions.map((suggestion) => ({
      ...suggestion,
      voters: [ authToken ],
      creator: authToken
    }));
  }
  return dimension.suggestions;
};

export const findUserOrCreate = async (arrUsers, User) => {
  const matchedUsers = await User.find({ email: { $in: arrUsers } });
  const matchedEmails = matchedUsers.map((user) => user.email);
  const newUsers = arrUsers.filter((email) => matchedEmails.indexOf(email) === -1);
  const createdUsers = await User.create(newUsers.map((email) => ({ email })));
  return [ ...(matchedUsers || []), ...(createdUsers || []) ].map((user) => user.id);
};
