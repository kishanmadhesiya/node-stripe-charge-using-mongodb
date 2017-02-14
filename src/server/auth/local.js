const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const init = require('./passport');
const knex = require('../db/connection');
const authHelpers = require('./_helpers');
var mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/mynode', {native_parser: true});
db.bind('users');
const options = {
  usernameField: 'email'
};

init();

passport.use(new LocalStrategy(options, (email, password, done) => {
  // check to see if the username exists
  db.users.findOne({email:email}, function (err, existingUser) {
    if (!existingUser){
    return done(null, false);
  }else if (!authHelpers.comparePass(password, existingUser.password)) {
      return done(null, false);
    } else {
      const user = {
        'email' : existingUser.email,
      'password'    : existingUser.password,
      'id'              : existingUser._id
    }
      return done(null, user);
    }
  });
}));

module.exports = passport;
