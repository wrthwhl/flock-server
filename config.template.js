const getConfig = (ENV) => {
  if (ENV && ENV.includes('dev')) {
    return {
      SECRET: '0hS0v3rYS3cr3T1sMYl1ttl3S3cr3t',
      apollo: {
        PORT: 4000,
        PLAYGROUND_SETTINGS: {
          'editor.theme': 'dark',
          'editor.fontFamily': 'Dank Mono',
          'editor.fontSize': 16,
          'editor.cursorShape': 'block'
        }
      },
      mongoose: [ 'mongodb://localhost/travelroo', { useNewUrlParser: true } ],
      facebook: {
        serverAccessToken: '' // <-- PUT facebook server access token here!
      }
    };
  }

  if (!ENV || ENV.includes('test')) {
    return {
      SECRET: '0hS0v3rYS3cr3T1sMYl1ttl3S3cr3t',
      apollo: {
        PORT: 4000,
        PLAYGROUND_SETTINGS: {
          'editor.theme': 'dark',
          'editor.fontFamily': 'Dank Mono',
          'editor.fontSize': 16,
          'editor.cursorShape': 'block'
        }
      },
      mongoose: [ 'mongodb://localhost/travelroo', { useNewUrlParser: true } ],
      facebook: {
        serverAccessToken: '' // <-- PUT facebook server access token here!
      }
    };
  }
};

export default getConfig(process.env['ENV']);
