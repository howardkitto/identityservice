//passport.js

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport, Identity)
{

//==================================================================
// Define the strategy to be used by PassportJS

passport.use(new LocalStrategy({
    passReqToCallback: true,
},
  function(req, username, password, done) {
    
    Identity.findOne({'local.username' : username}, 
                   function(err, user){
        if (err)
            return done(err);
        if(!user){
            console.log('User Not Found with username '+username);
            return done(null, false, {message: 'Incorrect username'})
        }
        if(!user.local.validPassword(password))
            {
            console.log('Invalid Password');
             return done(null, false, {message: 'Incorrect password'})        
            }
    
        return done(null, user);
    } )
        
  }
));
    
//// =========================================================================
//    // FACEBOOK ================================================================
//    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL  
    },
        function(token, refreshToken, profile, done) {
    
        process.nextTick(function() {
            Identity.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                console.log(profile);
                
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user); // user found, return that user
                }//close if (user)
                else {
                    var newUser            = new Identity();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
//                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                
                newUser.save(function(err) {
                    if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });//close newUser.save
                }//close else
            });//close user.findOne
        });//close process.nextTick
    }//close function token            
));//close passport.use

// Serialized and deserialized methods when got from session
passport.serializeUser(function(identity, done) {
    done(null, identity);
});

//passport.deserializeUser(function(user, done) {
//    done(null, user);
//});

 passport.deserializeUser(function(id, done) {
        Identity.findById(id, function(err, identity) {
            done(err, identity);
        });
    });    
    
};
