import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

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
        validator: function (v) {
          return validator.isURL(v);
        },
        message: "Debe ser una URL válida",
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
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: "Debe ser un email válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false, // No incluir la contraseña por defecto en las consultas
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
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified("password")) return next();

  try {
    // Hashear la contraseña con costo de 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para verificar contraseña
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método estático para encontrar usuario por credenciales
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email, isActive: true }).select(
    "+password"
  );

  if (!user) {
    throw new Error("Email o contraseña incorrectos");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Email o contraseña incorrectos");
  }

  // Actualizar último login
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Middleware para actualizar updatedAt en cada modificación
userSchema.pre(["updateOne", "findOneAndUpdate"], function () {
  this.set({ updatedAt: new Date() });
});

// Índices para optimizar consultas
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
