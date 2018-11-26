const getConfig = (ENV) => {
  if (ENV.includes('dev')) {
    return {
      apollo   : {
        PORT                : 4000,
        PLAYGROUND_SETTINGS : {
          'editor.theme'       : 'dark',
          'editor.fontFamily'  : 'Dank Mono',
          'editor.fontSize'    : 16,
          'editor.cursorShape' : 'block'
        }
      },
      mongoose : [ 'mongodb://localhost/travelroo', { useNewUrlParser: true } ]
    };
  }
};

export default getConfig(process.env['ENV']);
