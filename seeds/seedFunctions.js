const users = [
  {
    firstName: 'Damien',
    lastName: 'Derail',
    password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
    avatar:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
  },
  {
    firstName: 'Christopher',
    lastName: 'Bücklein',
    password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
    avatarURL:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
  },
  {
    firstName: 'Berta',
    lastName: 'Cume',
    password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
    avatar:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
  },
  {
    firstName: 'Arturo',
    lastName: 'Moreira Santos',
    password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
    avatar:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
  },
  {
    firstName: 'Marco',
    lastName: 'Kunz',
    password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
    avatar:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
  }
];

export function* getUsers(n = 1) {
  let i = 0;
  while (i < n) {
    yield ((user) => {
      const suffix = i < users.length ? '' : Math.floor(i / users.length);
      return {
        ...user,
        _id: ('' + i).repeat(24),
        firstName: (user.firstName += suffix),
        email: user.firstName.toLowerCase() + '@flock.io'
      };
    })(users[i % users.length]);
    i++;
  }
}
