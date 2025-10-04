import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';

import { prisma } from '../prisma/client';
import UserRepository from '../repositories/userRepository';
import type { GoogleProfile, VerifyCallback } from '../types/auth';

// your Prisma client

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL!}/oauth2/redirect/google`,
    },
    async (issuer: string, profile: GoogleProfile, cb: VerifyCallback) => {
      try {
        if (!profile.emails?.[0]?.value)
          throw new Error('Google profile has no email');

        const cred = await prisma.federatedCredentials.findUnique({
          where: {
            provider_subject: {
              provider: issuer,
              subject: profile.id,
            },
          },
        });

        if (!cred) {
          // New user
          const user = await UserRepository.createNewUser({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            username: '',
            password: '',
          });

          await prisma.federatedCredentials.create({
            data: {
              userId: user.id,
              provider: issuer,
              subject: profile.id,
            },
          });

          return cb(null, user);
        } else {
          // Existing user
          const user = await prisma.user.findUnique({
            where: { id: cred.userId },
          });

          if (!user) return cb(null, false);
          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
