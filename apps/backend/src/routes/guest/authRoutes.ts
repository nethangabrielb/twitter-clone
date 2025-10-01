import { Router } from 'express';

import passport from 'passport';

import authController from '../../controllers/guest/authController';
import { validateRegistration } from '../../validators/user/register';

const authRouter = Router();

authRouter.post('/register', validateRegistration, authController.register);
authRouter.post('/login', authController.login);

authRouter.get('/login/google', passport.authenticate('google'));
authRouter.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  authController.redirect
);

export default authRouter;
