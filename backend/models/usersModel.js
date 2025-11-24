import mongoose from "mongoose";
import {
  hashPasswordMiddleware,
  updateTimestampMiddleware,
} from "../middleware/modelMiddleware.js";
import { comparePassword } from "../services/hashService.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede tener más de 30 caracteres"],
      trim: true,
    },
    // about: {
    //   type: String,
    //   minlength: [2, "La descripción debe tener al menos 2 caracteres"],
    //   maxlength: [30, "La descripción no puede tener más de 30 caracteres"],
    //   default: "",
    //   trim: true,
    // },
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
          // Usar una regex más estándar y robusta para emails
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
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Aplicar middleware de hashing (separado del modelo)
userSchema.pre("save", hashPasswordMiddleware);

// Método para verificar contraseña (delegando al servicio)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

// Aplicar middleware de timestamp
userSchema.pre(["updateOne", "findOneAndUpdate"], updateTimestampMiddleware);

// Índices para optimizar consultas
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
