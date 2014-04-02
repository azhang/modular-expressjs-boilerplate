//TODO: let users merge their local accounts with goog/fb.
//      If authenticated then 3rd party login, search if account with id
//      exists. if does, then delete old. possibly merge...

var mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , User = mongoose.model('User')
  , config = require('./config');


// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User
    .findOne( { _id: id } )
    .select('-salt -hashed_password')
    .exec(function(err,user) {
      done(err, user);
    });

  /* TODO: implement roles and add them to user
  app.db.models.User.findOne({
      _id: id
  }).populate('roles.admin').populate('roles.account').exec(function(err, user) {
       
     // TODO:
     // when mongoose supports calling populate on embedded documents,
     // we can change this code and stop using the '_groups' hack since
     // assigning direcly to 'groups' doesn't stick right now
     // https://github.com/LearnBoost/mongoose/issues/601
     

    if (user.roles && user.roles.admin && user.roles.admin.groups) {
        app.db.models.AdminGroup.find({
            _id: {
                $in: user.roles.admin.groups
            }
        }).exec(function(err, groups) {
            user.roles.admin._groups = groups;
            done(err, user);
        });
    }
    else {
        done(err, user);
        //done(null, id);
    }
  });
  */
});

// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, 
  function(username, password, done){
    User.findOne({
      username: username.toLowerCase()
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Unknown user'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid password'
        });
      }
      return done(null, user);
    });
  }
));

// Use twitter strategy
passport.use(new TwitterStrategy({
    consumerKey: config.auth.twitter.clientID,
    consumerSecret: config.auth.twitter.clientSecret,
    callbackURL: config.auth.twitter.callbackURL
  }, 
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'twitter.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          displayName: profile.displayName,
          username: profile.username,
          provider: 'twitter',
          twitter: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
));

// Use facebook strategy
passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.clientID,
    clientSecret: config.auth.facebook.clientSecret,
    callbackURL: config.auth.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'facebook.id': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'facebook',
          facebook: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
));

// Use github strategy
passport.use(new GitHubStrategy({
    clientID: config.auth.github.clientID,
    clientSecret: config.auth.github.clientSecret,
    callbackURL: config.auth.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'github.id': profile.id
    }, function(err, user) {
      if (!user) {
        user = new User({
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'github',
          github: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
));

// Use google strategy
passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: config.auth.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'google.id': profile.id
    }, function(err, user) {
      if (!user) {
        user = new User({
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'google',
          google: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
));

// Legacy
// The following is for migrating old google openIDs to google oauth.
// Use google strategy
/*
passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: config.auth.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    var query = { googleID: profile.id };
    if ( typeof profile.emails[0] !== undefined ) {
      query = {
        $or: [
          { googleID: profile.id },
          { 
            email: profile.emails[0].value,
            googleID_openid: { $exists: true }
          }
        ]
      };
    }
    accounts.findAndModify(query, {},
// {$iset: { openID: idenfitier, profile:profile }}, iset released in mongo2.3.2
      { 
        $set: {
          googleID: profile.id, 
          displayName: profile.displayName,
          email: (typeof profile.emails[0] === undefined ) ? "" : profile.emails[0].value,
          fullName: profile.name
        },
        $unset: { 
          googleID_openid: true 
        }
      }, 
      {"update":true, "upsert":true, "new":true}, function (err, user) {
      return done(err, user);
    });
  }
));
*/

// Legacy
// Use facebook strategy
/*
passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.clientID,
    clientSecret: config.auth.facebook.clientSecret,
    callbackURL: config.auth.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    accounts.findAndModify({ facebookID: profile.id },{},
      // {$iset: { facebookId:profile.id, profile:profile }}, iset released in mongo2.3.2
      // Right now it will overwrite what you have in Thinkerous system with FB info
      { 
        $set: {
          facebookID: profile.id, 
          displayName: profile.displayName,
          email: (typeof profile.emails[0] === undefined ) ? "" : profile.emails[0].value,
          fullName: profile.name,
          facebook_user: profile.username
        } 
      }, 
      {"update":true, "upsert":true, "new":true}, function (err, user) {
      return done(err, user);
    });
  }
));
*/