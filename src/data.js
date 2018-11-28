const data = {
  users : [
    {
      firstName  : 'Damien',
      lastName   : 'Derail',
      email      : 'damien@nuts.io',
      avatar_url :
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      firstName  : 'Christopher',
      lastName   : 'Bücklein',
      email      : 'christopher@nuts.io',
      avatar_url :
        'https://lh3.googleusercontent.com/-VSwsPyjYXGY/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-gk_wJCQYzx0KwsZMWANFn5M53qTw/s192-c-mo/photo.jpg'
    },
    {
      firstName  : 'Berta',
      lastName   : 'Cume',
      email      : 'berta@nuts.io',
      avatar_url :
        'https://lh3.googleusercontent.com/-VSwsPyjYXGY/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-gk_wJCQYzx0KwsZMWANFn5M53qTw/s192-c-mo/photo.jpg'
    },
    {
      firstName  : 'Arturo',
      lastName   : 'Moreira Santos',
      email      : 'arturo@nuts.io',
      avatar_url :
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      firstName  : 'Marco',
      lastName   : 'Kunz',
      email      : 'marco@nuts.io',
      avatar_url :
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2214523381894195&height=50&width=50&ext=1545667808&hash=AeQS0U1scG7CstHf'
    },
    {
      firstName  : 'Poor',
      lastName   : 'Guy',
      email      : 'poor.guy@nuts.io',
      avatar_url : ''
    }
  ]
};

const users = (users) => {
  let res = [];
  users.forEach(({ firstName, lastName }, id) =>
    res.push({
      id,
      firstName,
      lastName,
      email     : firstName.toLowerCase() + '@travelnuts.io'
    })
  );
  return res;
};

export default {
  users : users(data.users),
};
