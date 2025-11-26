import mongoose from "mongoose";
import {
  hashPasswordMiddleware,
  updateTimestampMiddleware,
} from "../middleware/modelMiddleware.js";
import { comparePassword as comparePasswordService } from "../services/hashService.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede tener más de 30 caracteres"],
      trim: true,
    },

    avatar: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/487/879/png-clipart-computer-icons-question-mark-question-miscellaneous-blue.png",
      validate: {
        validator(v) {
          return /^(http|https):\/{2}[._~:\/?%#\]@!$&'()*+,;=A-Za-z0-9\-]+/.test(
            v
          );
        },
        message: (props) => `${props.value} debe ser una URL válida`,
      },
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator(v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} debe ser un email válido`,
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const userObject = { ...ret };
        delete userObject.password;

        delete userObject.__v;
        return userObject;
      },
    },
  }
);

userSchema.pre("save", hashPasswordMiddleware);

userSchema.methods.comparePassword = async function comparePasswordMethod(
  candidatePassword
) {
  return comparePasswordService(candidatePassword, this.password);
};

userSchema.pre(["updateOne", "findOneAndUpdate"], updateTimestampMiddleware);

userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
