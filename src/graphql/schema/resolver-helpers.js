export const mergeProps = (key, ...objects) => ({
  key,
  ...objects.reduce((arr, obj) => ({ ...arr, ...(obj[key] || obj(key)) }), {})
});

export const voters = ({ voters }, _, { User }) => voters.map((id) => User.getOne(id));

export const creator = ({ creator }, _, { User }) => User.getOne(creator);
