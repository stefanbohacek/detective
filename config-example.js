var config = {};

/* https://botwiki.org/resource/tutorial/how-to-create-a-twitter-app/ */

config.twitter = {
  consumer_key: 'CONSUMERKEY',
  consumer_secret: 'CONSUMERSECRET',
  access_token: 'ACCESSTOKEN',
  access_token_secret: 'ACCESSTOKENSECRET',
  callbackURL: "URL"
}

/* Used to secure the session, can be anything. */

config.secret = '';

/* Your database settings. */

config.db = {
  host : 'localhost',
  user     : '',
  password : '',
  database : ''
}

module.exports = config;
