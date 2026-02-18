import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: function () {
        return this.authProvider !== "google"; // ✅ phone only required for non-google
      },
    },


    googleId: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user","admin"],
      default: "user"
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    phoneOTP: {
      type: String,
    },
    phoneOTPExpiry: {
      type: Date,
    },

    otpLastSentAt: {
      type: Date,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    emailVerificationToken: String,
    emailVerificationTokenExpire: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    addresses: [addressSchema],
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
