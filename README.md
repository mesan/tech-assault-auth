# TechAssault Authentication Service

## Description

Service handling authentication and sessions in the TechAssault game.

## Contributors

- Jan Eirik H.
- Hans Kristian R.
- Christian J.
- Arild T.

## Requirements

* A running MongoDB instance.
* Environment variables set up:
    * TECH_AUTH_MONGOLAB_URI: The connection string pointing to your MongoDB instance (eg.
    `"mongodb://localhost:27017/techassault-auth"`)
    * TECH_AUTH_TOKEN_TTL: The TTL (time-to-live) for session in milliseconds (eg. `2592000`).
    * TECH_AUTH_LOGIN_REDIRECT_URL: The URL to redirect to after 3rd party login.
    * TECH_AUTH_LOGOUT_REDIRECT_URL: The URL to redirect to after 3rd party logout.
    * TECH_AUTH_TWITTER_CLIENT_ID: Your Twitter app client ID. (Create Twitter app here: https://apps.twitter.com/)
    * TECH_AUTH_TWITTER_CLIENT_SECRET: Your Twitter app client secret.
    * TECH_AUTH_ID_PREFIX_TWITTER: The prefix for user IDs from Twitter (eg. `"tw-"`) used by this authentication
    service. The prefixes are used to differentiate two potentially identical user IDs from two different 3rd party
    login providers.

## Set Up

    npm install
    npm start

## Develop

    nodemon