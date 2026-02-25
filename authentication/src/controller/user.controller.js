import sendSms from "../services/sendSms.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import genrateOtp from "../utility/genrateOtp.js";
import { redis } from "../db/redis.js";
import { publishToQueue } from "../broker/rabbit.js";

export async function signUpWithPhone(req, res) {
  try {
    const { phone, name, email } = req.body;

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    let user = await userModel.findOne({ phone: formattedPhone });

    if (!user) {
      user = await userModel.create({
        phone: formattedPhone,
        name: name || "",
        email: email || "",
        isPhoneVerified: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.phoneOTP = otp;
    user.phoneOTPExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log(`OTP generated for ${formattedPhone}: ${otp}`);

    await sendSms(
      formattedPhone,
      `Your verification code is ${otp}. Valid for 15 minutes.`,
    );

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP failed:", error.message);
    return res.status(500).json({
      message: "Failed to send OTP. Please try again.",
    });
  }
}

export async function signUpVerifyOtp(req, res) {
  try {
    const { phone, otp, password } = req.body;

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    if (!formattedPhone || !otp || !password) {
      return res.status(400).json({
        message: "Phone, OTP, and password are required",
      });
    }

    const user = await userModel
      .findOne({ phone: formattedPhone })
      .select("+password +phoneOTP +phoneOTPExpiry");

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please request OTP again.",
      });
    }

    if (
      !user.phoneOTP ||
      user.phoneOTP !== otp ||
      user.phoneOTPExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isPhoneVerified = true;
    user.phoneOTP = undefined;
    user.phoneOTPExpiry = undefined;
    user.lastLogin = new Date();

    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await publishToQueue("user_created", {
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User verified and registered successfully",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role : user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Failed to verify OTP. Please try again.",
    });
  }
}

export async function signUpWithEmail(req, res) {
  try {
    const { phone, email, name, password } = req.body;

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const isExist = await userModel.findOne({
      $or: [{ email }, { phone: formattedPhone }],
    });

    if (isExist) {
      return res.status(409).json({
        message: "User with this email or phone already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      phone: formattedPhone,
      email,
      name: name || "Guest",
      password: hashed,
      isPhoneVerified: false,
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await publishToQueue("user_created", {
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User signed up successfully",
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to sign up with email. Please try again.",
    });
  }
}

export async function loginWithPhone(req, res) {
  try {
    let { phone } = req.body;

    if (phone === undefined || phone === null) {
      return res.status(400).json({
        message: "Phone number is required to login",
      });
    }

    // Force string safely
    phone = String(phone).trim();

    // Remove spaces, dashes, brackets
    phone = phone.replace(/[^\d+]/g, "");

    // Validate numeric phone
    if (!/^\+?\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number format",
      });
    }

    // Normalize to +91 format
    const formattedPhone = phone.startsWith("+")
      ? phone
      : `+91${phone.slice(-10)}`;

    console.log("Searching phone:", formattedPhone);

    // Flexible DB search (handles bad stored data)
    const user = await userModel.findOne({
      phone: { $regex: formattedPhone.slice(-10) + "$" },
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
      });
    }

    if (!user.isPhoneVerified) {
      return res.status(403).json({
        message: "Phone number not verified. Please verify to login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.phoneOTP = otp;
    user.phoneOTPExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log(`Login OTP generated for ${formattedPhone}: ${otp}`);

    await sendSms(
      formattedPhone,
      `Your login verification code is ${otp}. Valid for 15 minutes.`,
    );

    return res.status(200).json({
      message: "Login OTP sent successfully",
    });
  } catch (error) {
    console.error("LOGIN PHONE ERROR:", error);

    return res.status(500).json({
      message: "Failed to login with phone. Please try again.",
      error: error.message,
    });
  }
}

export async function loginVerifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    if (!formattedPhone || !otp) {
      return res.status(400).json({
        message: "phone and Otp are required",
      });
    }

    const user = await userModel
      .findOne({
        phone: formattedPhone,
      })
      .select("+phoneOTP +phoneOTPExpiry");

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please request OTP again.",
      });
    }

    if (
      !user.phoneOTP ||
      user.phoneOTP !== otp ||
      user.phoneOTPExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.phoneOTP = undefined;
    user.phoneOTPExpiry = undefined;
    user.lastLogin = new Date();

    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
      message: "Login successful",
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify login OTP. Please try again.",
    });
  }
}

export async function resendOtp(req, res) {   
  try {
    const { phone, type } = req.body;
    const otpType = type || "login";

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const user = await userModel.findOne({ phone: formattedPhone });
    if (!user && otpType === "login") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpKey = `otp:${otpType}:${formattedPhone}`;
    const cooldownKey = `otp:cooldown:${otpType}:${formattedPhone}`;

    const cooldown = await redis.get(cooldownKey);
    if (cooldown) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before resending OTP",
      });
    }

    const otp = genrateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await redis.set(otpKey, hashedOtp, "EX", 600);
    await redis.set(cooldownKey, "1", "EX", 60);

    await sendSms(formattedPhone, otp);

    return res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function googleOAuthCallback(req, res) {
  try {
    const googleUser = req.user;

    if (!googleUser) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    const email = googleUser.emails?.[0]?.value;
    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    const name =
      googleUser.displayName ||
      `${googleUser.name?.givenName ?? ""} ${googleUser.name?.familyName ?? ""}`.trim();

    let isUserAlreadyExist = await userModel.findOne({
      $or: [{ email }, { googleId: googleUser.id }],
    });

    let user;

    if (isUserAlreadyExist) {
      user = isUserAlreadyExist;
    } else {
      user = await userModel.create({
        email,
        googleId: googleUser.id,
        name,
        authProvider: "google",
      });
    }

    console.log("GOOGLE EMAIL:", email);
    await publishToQueue("user_created", {
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in prod
    });

    return res.status(200).json({
      message: isUserAlreadyExist
        ? "User logged in successfully"
        : "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Google Auth Callback error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function forgetPassword(req, res) {}

export async function resetPassword(req, res) {}

export async function getMe(req, res) {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
}

export const getUserCount = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user count" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const filter = {
      ...(role && { role }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const users = await userModel
      .find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .select("-password");

    const total = await userModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAddresses = async (req, res) => {
  const id = req.user.id;

  const user = await userModel.findById(id).select("addresses");

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: "Addresses fetched successfully",
    addresses: user.addresses,
  });
};

export const addUserAddress = async (req, res) => {
  const id = req.user.id;

  const { street, city, state, pincode, country, isDefault } = req.body;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        addresses: {
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      },
    },
    { new: true },
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(201).json({
    message: "Address added successfully",
    address: user.addresses[user.addresses.length - 1],
  });
};

export const deleteUserAddress = async (req, res) => {
  const id = req.user.id;
  const { addressId } = req.params;

  const isAddresesExists = await userModel.findOne({
    _id: id,
    "addresses._id": addressId,
  });

  if (!isAddresesExists) {
    return res.status(404).json({ message: "Address not found" });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { $pull: { addresses: { _id: addressId } } },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const addressExists = user.addresses.some(
    (addr) => addr._id.toString() === addressId,
  );
  if (addressExists) {
    return res.status(404).json({ message: "Address not found" });
  }

  return res.status(200).json({
    message: "Address deleted successfully",
    addresses: user.addresses,
  });
};
