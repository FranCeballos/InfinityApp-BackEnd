const User = require("../models/user.js");
const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const userExists = await User.findOne({ email: email });
          if (userExists) {
            return done(null, false, { message: "Email already in use" });
          }
          const body = req.body;
          const user = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            age: body.age,
            phoneCharacteristic: body.phoneCharacteristic,
            phone: body.phone,
            country: body.country,
            password: body.password,
            avatar: body.avatar,
          });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) return done(null, false);
        const isValid = await user.isValidPassword(password);
        console.log("isValid", isValid);
        if (!isValid) return done(null, false);
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  });

  passport.deserializeUser((user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  });
};
