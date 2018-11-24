#DEVELOPERS NOTE

##How to get branch authentication working
I removed the files
`config.js`
and
`.env`
from this repo in order to prevent API misusage.

Please add the following files yourself and add their contents to .gitignore.

###config.js

````module.exports = {
  session: {
    keys: [ ****Placeholder for the secret key I sent you on slack**** ]
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackUrl: 'http://localhost:3001/api/auth/callback',
    profileFields: [ 'id', 'displayName', 'photos', 'email' ]
  }
};```

###.env

````

FACEBOOK_APP_ID=**_Placeholder for the FACEBOOK_APP_ID I sent you on slack_**
FACEBOOK_APP_SECRET=**_Placeholder for the FACEBOOK_APP_SECRET I sent you on slack_**
FACEBOOK_CALLBACK=http://localhost:3001/auth/facebook/callback

```

```
