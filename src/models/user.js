import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
// import { isEmail } from "validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please pass in a valid email pleaaaaase"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    paymentReference: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Enter Correct Password");
  }
  throw Error("Incorrect Email");
};

const User = model("User", userSchema);

export default User;
