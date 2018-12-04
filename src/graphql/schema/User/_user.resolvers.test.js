describe('schema', () => {
  test('has valid type definitions', async () => {});
});

describe('user', () => {
  test('has a valid first name', async () => {
    expect(user.firstName).toEqual('Damien');
    expect(user.firstName).not.toMatch('Marco');
  });
  test('has a valid last name', async () => {
    expect(user.lastName).toMatch(/Derail/);
    expect(user.lastName).not.toMatch(/Kuntz/);
  });
  test('has a valid email', async () => {
    expect(user.email).toMatch('@');
    expect(user.email).toBeDefined();
  });
  test('password to match user password', async () => {
    expect(user.password).toEqual(
      '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi'
    );
  });
  test('user must be linked to and id', async () => {
    expect(user._id).toBeTruthy();
    expect(user._id).toMatch(/000000000000000000000000/);
    expect(user._id).not.toBeUndefined();
  });
});

const user = {
  _id: '000000000000000000000000',
  firstName: 'Damien',
  lastName: 'Derail',
  password: '$2b$12$D2IkUfk1IFnomxPOec6yDeYhfg54bK051/TJYt8sI9GzyWN.maUTi',
  email: 'damien@flock.io'
};
