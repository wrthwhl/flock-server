export const mergeProps = (key, ...objects) => ({
  key,
  ...objects.reduce((arr, obj) => ({ ...arr, ...(obj[key] || obj(key)) }), {})
});
export const users = (arrayOfUserIDs, User) => User.find({ _id: { $in: arrayOfUserIDs } });

export const voters = ({ voters }, _, { User }) => users(voters, User);

export const creator = ({ creator }, _, { User }) => User.findOne(creator);
