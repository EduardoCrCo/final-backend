import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel.js";
import handleFailError from "../utils/handleErrors.js";
import AuthService from "../services/authService.js";

const generateToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET || "tu-clave-secreta-muy-segura",
    { expiresIn: "7d" }
  );

export const signup = async (req, res, next) => {
  try {
    //console.log("📝 Signup request body:", JSON.stringify(req.body, null, 2));

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
        details: {
          name: !name ? "El nombre es requerido" : null,
          email: !email ? "El email es requerido" : null,
          password: !password ? "La contraseña es requerida" : null,
        },
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "El usuario con este email ya existe",
      });
    }

    const user = new UserModel({
      name: name || "Usuario",
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: messages,
      });
    }
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos",
      });
    }

    const user = await AuthService.findUserByCredentials(email, password);

    await AuthService.updateLastLogin(user._id);

    const token = generateToken(user._id);

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    if (error.message === "Email o contraseña incorrectos") {
      return res.status(401).json({ message: error.message });
    }
    return next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId).orFail(
      handleFailError
    );

    if (!user.isActive) {
      return res.status(404).json({
        message: "Usuario no encontrado o inactivo",
      });
    }

    return res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.userId,
      {
        ...(name && { name }),
        ...(about && { about }),
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).orFail(handleFailError);

    if (!user.isActive) {
      return res.status(404).json({
        message: "Usuario no encontrado o inactivo",
      });
    }

    return res.json({
      message: "Perfil actualizado exitosamente",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: messages,
      });
    }
    return next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.userId,
      {
        avatar,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).orFail(handleFailError);

    if (!user.isActive) {
      return res.status(404).json({
        message: "Usuario no encontrado o inactivo",
      });
    }

    return res.json({
      message: "Avatar actualizado exitosamente",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "URL del avatar inválida",
        errors: messages,
      });
    }
    return next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ isActive: true })
      .select("name about avatar email createdAt lastLogin")
      .sort({ createdAt: -1 });

    res.json({
      message: "Usuarios obtenidos exitosamente",
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.user.userId,
      {
        isActive: false,
        updatedAt: new Date(),
      },
      { new: true }
    ).orFail(handleFailError);

    res.json({
      message: "Cuenta desactivada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
