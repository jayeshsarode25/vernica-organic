import sendSms from "../services/sendSms.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import genrateOtp from "../utility/genrateOtp.js";
import { redis } from "../db/redis.js";
import { publishToQueue } from "../broker/rabbit.js";
import { AppError, catchAsync } from "../utils/error.utils.js"; // ✅

// ─────────────────────────────────────────────────────────────────
// SIGN UP WITH PHONE — send OTP
// ─────────────────────────────────────────────────────────────────
export const signUpWithPhone = catchAsync(async (req, res) => {
  const { phone, name, email } = req.body;

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  let user = await userModel.findOne({ phone: formattedPhone });

  if (!user) {
    user = await userModel.create({
      phone: formattedPhone,
      name:  name  || "",
      email: email || "",
      isPhoneVerified: false,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.phoneOTP       = otp;
  user.phoneOTPExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  console.log(`OTP generated for ${formattedPhone}: ${otp}`);

  await sendSms(
    formattedPhone,
    `Your verification code is ${otp}. Valid for 15 minutes.`
  );

  res.status(200).json({ message: "OTP sent successfully" });
});

// ─────────────────────────────────────────────────────────────────
// SIGN UP VERIFY OTP
// ─────────────────────────────────────────────────────────────────
export const signUpVerifyOtp = catchAsync(async (req, res) => {
  const { phone, otp, password } = req.body;

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  if (!formattedPhone || !otp || !password) {
    throw new AppError("Phone, OTP, and password are required", 400);
  }

  const user = await userModel
    .findOne({ phone: formattedPhone })
    .select("+password +phoneOTP +phoneOTPExpiry");

  if (!user) {
    throw new AppError("User not found. Please request OTP again.", 404);
  }

  if (!user.phoneOTP || user.phoneOTP !== otp || user.phoneOTPExpiry < Date.now()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.password        = await bcrypt.hash(password, 10);
  user.isPhoneVerified = true;
  user.phoneOTP        = undefined;
  user.phoneOTPExpiry  = undefined;
  user.lastLogin       = new Date();
  await user.save();

  const token = jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  await publishToQueue("user_created", {
    id:    user._id,
    phone: user.phone,
    name:  user.name,
    email: user.email,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure:   false,
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User verified and registered successfully",
    user: {
      id:              user._id,
      phone:           user.phone,
      name:            user.name,
      email:           user.email,
      role:            user.role,
      isPhoneVerified: user.isPhoneVerified,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// SIGN UP WITH EMAIL
// ─────────────────────────────────────────────────────────────────
export const signUpWithEmail = catchAsync(async (req, res) => {
  const { phone, email, name, password } = req.body;

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  const isExist = await userModel.findOne({
    $or: [{ email }, { phone: formattedPhone }],
  });

  if (isExist) {
    throw new AppError("User with this email or phone already exists", 409);
  }

  const user = await userModel.create({
    phone:           formattedPhone,
    email,
    name:            name || "Guest",
    password:        await bcrypt.hash(password, 10),
    isPhoneVerified: false,
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  await publishToQueue("user_created", {
    id:    user._id,
    phone: user.phone,
    name:  user.name,
    email: user.email,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure:   true,
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User signed up successfully",
    user: {
      _id:             user._id,
      phone:           user.phone,
      email:           user.email,
      name:            user.name,
      isPhoneVerified: user.isPhoneVerified,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// LOGIN WITH PHONE — send OTP
// ─────────────────────────────────────────────────────────────────
export const loginWithPhone = catchAsync(async (req, res) => {
  let { phone } = req.body;

  if (phone === undefined || phone === null) {
    throw new AppError("Phone number is required to login", 400);
  }

  phone = String(phone).trim().replace(/[^\d+]/g, "");

  if (!/^\+?\d{10,15}$/.test(phone)) {
    throw new AppError("Invalid phone number format", 400);
  }

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.slice(-10)}`;

  const user = await userModel.findOne({
    phone:    { $regex: formattedPhone.slice(-10) + "$" },
    isActive: true,
  });

  if (!user) {
    throw new AppError("User not found. Please sign up first.", 404);
  }

  if (!user.isPhoneVerified) {
    throw new AppError("Phone number not verified. Please verify to login.", 403);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.phoneOTP       = otp;
  user.phoneOTPExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  console.log(`Login OTP generated for ${formattedPhone}: ${otp}`);

  await sendSms(
    formattedPhone,
    `Your login verification code is ${otp}. Valid for 15 minutes.`
  );

  res.status(200).json({ message: "Login OTP sent successfully" });
});

// ─────────────────────────────────────────────────────────────────
// LOGIN VERIFY OTP
// ─────────────────────────────────────────────────────────────────
export const loginVerifyOtp = catchAsync(async (req, res) => {
  const { phone, otp } = req.body;

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  if (!formattedPhone || !otp) {
    throw new AppError("Phone and OTP are required", 400);
  }

  const user = await userModel
    .findOne({ phone: formattedPhone })
    .select("+phoneOTP +phoneOTPExpiry");

  if (!user) {
    throw new AppError("User not found. Please request OTP again.", 404);
  }

  if (!user.phoneOTP || user.phoneOTP !== otp || user.phoneOTPExpiry < Date.now()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.phoneOTP       = undefined;
  user.phoneOTPExpiry = undefined;
  user.lastLogin      = new Date();
  await user.save();

  const token = jwt.sign(
    { userId: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure:   false,
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      _id:             user._id,
      phone:           user.phone,
      email:           user.email,
      name:            user.name,
      role:            user.role,
      isPhoneVerified: user.isPhoneVerified,
      lastLogin:       user.lastLogin,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// RESEND OTP
// ─────────────────────────────────────────────────────────────────
export const resendOtp = catchAsync(async (req, res) => {
  const { phone, type } = req.body;
  const otpType = type || "login";

  if (!phone) {
    throw new AppError("Phone number is required", 400);
  }

  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  const user = await userModel.findOne({ phone: formattedPhone });
  if (!user && otpType === "login") {
    throw new AppError("User not found", 404);
  }

  const cooldownKey = `otp:cooldown:${otpType}:${formattedPhone}`;
  const cooldown    = await redis.get(cooldownKey);

  if (cooldown) {
    throw new AppError("Please wait 60 seconds before resending OTP", 429);
  }

  const otp       = genrateOtp();
  const otpKey    = `otp:${otpType}:${formattedPhone}`;
  const hashedOtp = await bcrypt.hash(otp, 10);

  await redis.set(otpKey,    hashedOtp, "EX", 600);
  await redis.set(cooldownKey, "1",     "EX", 60);

  await sendSms(formattedPhone, otp);

  res.json({ message: "OTP sent successfully" });
});

// ─────────────────────────────────────────────────────────────────
// GOOGLE OAUTH CALLBACK
// ─────────────────────────────────────────────────────────────────
export const googleOAuthCallback = catchAsync(async (req, res) => {
  const googleUser = req.user;

  if (!googleUser) {
    throw new AppError("Google authentication failed", 401);
  }

  const email = googleUser.emails?.[0]?.value;
  if (!email) {
    throw new AppError("Google account has no email", 400);
  }

  const name =
    googleUser.displayName ||
    `${googleUser.name?.givenName ?? ""} ${googleUser.name?.familyName ?? ""}`.trim();

  let user = await userModel.findOne({
    $or: [{ email }, { googleId: googleUser.id }],
  });

  const isNewUser = !user;

  if (!user) {
    user = await userModel.create({
      email,
      googleId:     googleUser.id,
      name,
      authProvider: "google",
    });
  }

  await publishToQueue("user_created", {
    id:    user._id,
    phone: user.phone,
    name:  user.name,
    email: user.email,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure:   false, // set true in production
  });

  res.status(200).json({
    message: isNewUser ? "User registered successfully" : "User logged in successfully",
    user: {
      id:    user._id,
      email: user.email,
      name:  user.name,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// FORGET / RESET PASSWORD — to be implemented
// ─────────────────────────────────────────────────────────────────
export const forgetPassword = catchAsync(async (req, res) => {
  throw new AppError("Forget password not implemented yet", 501);
});

export const resetPassword = catchAsync(async (req, res) => {
  throw new AppError("Reset password not implemented yet", 501);
});

// ─────────────────────────────────────────────────────────────────
// GET ME
// ─────────────────────────────────────────────────────────────────
export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ user: req.user });
});

// ─────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────
export const logout = catchAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure:   true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// ─────────────────────────────────────────────────────────────────
// ADMIN — USER MANAGEMENT
// ─────────────────────────────────────────────────────────────────

export const getUserCount = catchAsync(async (req, res) => {
  const totalUsers = await userModel.countDocuments();
  res.json({ totalUsers });
});

export const getUser = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = "", role } = req.query;

  const pageNum  = Number(page);
  const limitNum = Number(limit);

  const filter = {
    ...(role && { role }),
    ...(search && {
      $or: [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    userModel
      .find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .select("-password"),
    userModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success:    true,
    users,
    total,
    page:       pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.params.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json(user);
});

export const deleteUser = catchAsync(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, message: "User deleted successfully" });
});

export const blockUser = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
    user,
  });
});

export const getUserAddresses = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.user.id).select("addresses");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    message:   "Addresses fetched successfully",
    addresses: user.addresses,
  });
});

export const addUserAddress = catchAsync(async (req, res) => {
  const { street, city, state, pincode, country, isDefault } = req.body;

  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { $push: { addresses: { street, city, state, pincode, country, isDefault } } },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(201).json({
    message: "Address added successfully",
    address: user.addresses[user.addresses.length - 1],
  });
});

export const deleteUserAddress = catchAsync(async (req, res) => {
  const { addressId } = req.params;

  const addressExists = await userModel.findOne({
    _id:            req.user.id,
    "addresses._id": addressId,
  });

  if (!addressExists) {
    throw new AppError("Address not found", 404);
  }

  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    message:   "Address deleted successfully",
    addresses: user.addresses,
  });
});