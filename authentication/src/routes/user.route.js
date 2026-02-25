import express from "express";
import * as authController from "../controller/user.controller.js";
import createAuthMiddleware from "../middleware/auth.middleware.js";
import * as validate from "../middleware/validation.middleware.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/signup-phone",
  validate.sendOtpValidator,
  authController.signUpWithPhone,
);

router.post(
  "/verify-phone-otp",
  validate.verifyOtpValidator,
  authController.signUpVerifyOtp,
);

router.post(
  "/signup-email",
  validate.signUpEmailValidator,
  authController.signUpWithEmail,
);

router.post("/login-phone", validate.login, authController.loginWithPhone);

router.post(
  "/verify-login-otp",
  validate.loginWithOtpValidator,
  authController.loginVerifyOtp,
);

router.post("/resend-otp", authController.resendOtp);

// Route to initiate Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleOAuthCallback);


router.get("/me", createAuthMiddleware(["user","admin"]), authController.getMe);

router.get("/logout", createAuthMiddleware(["user"]), authController.logout);

router.get("/count",createAuthMiddleware(["admin"]), authController.getUserCount);

router.get("/users", createAuthMiddleware(["admin"]), authController.getUser);

router.get(
  "/users/:id",
  createAuthMiddleware(["admin"]),
  authController.getUserById,
);

router.delete(
  "/users/:id",
  createAuthMiddleware(["admin"]),
  authController.deleteUser,
);

router.patch(
  "/users/:id/block",
  createAuthMiddleware(["admin"]),
  authController.blockUser,
);

router.get('/users/me/addresses', createAuthMiddleware(["user"]), authController.getUserAddresses);
router.post('/users/me/addresses', createAuthMiddleware(["user"]), authController.addUserAddress);
router.delete('/users/me/addresses/:addressId', createAuthMiddleware(["user"]), authController.deleteUserAddress);

export default router;
