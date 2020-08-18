const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcrypt');



/* module.exports = function (passport) {

    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: 'email' },
function (email, password, done) {
    console.log('strategy work!!!!')
    // Match Username
    let query = {
        email: email
    };
    console.log(query)//=========================================-=-=-==-=-=-=-=-=-=-=-=-==-=-=-=
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'User undefined'
            });
        }
        // Match Password
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
}
 */