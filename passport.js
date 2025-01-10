import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/user.js";
import createToken from "./jwt/jwt.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: `https://api.worldtoday.me/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Generate a new token
          const token = await createToken(user);
          user.token = token; // Replace old token or set new one
          await user.save(); // Save the updated user with the new token
          return done(null, user);
        }

        // Create a new user if not found
        const newUser = await User.create({
          id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          role: "USER",
          avatar: profile.photos[0].value,
        });

        // Generate a token for the new user
        const token = await createToken(newUser);
        newUser.token = token;
        await newUser.save(); // Save the new user with the token
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
          
