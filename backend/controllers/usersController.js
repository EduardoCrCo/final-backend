import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel.js";
import handleFailError from "../utils/handleErrors.js";
import AuthService from "../services/authService.js";

// Función para generar JWT token
const generateToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET || "tu-clave-secreta-muy-segura",
    { expiresIn: "7d" }
  );

// Registrar nuevo usuario
export const signup = async (req, res, next) => {
  try {
    // Log para debugging
    console.log("📝 Signup request body:", JSON.stringify(req.body, null, 2));

    const { name, email, password, about = "" } = req.body;

    // Validar que los campos requeridos estén presentes
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

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "El usuario con este email ya existe",
      });
    }

    // Crear nuevo usuario
    const user = new UserModel({
      name: name || "Usuario",
      email,
      password,
      // about: about || "Explorador",
    });

    await user.save();

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
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
    next(error);
  }
};

// Iniciar sesión
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario por credenciales usando el servicio
    const user = await AuthService.findUserByCredentials(email, password);

    // Actualizar último login
    await AuthService.updateLastLogin(user._id);

    // Generar token
    const token = generateToken(user._id);

    res.json({
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
    next(error);
  }
};

// Obtener información del usuario actual
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

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil del usuario
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
        new: true, // Retorna el documento actualizado
        runValidators: true, // Ejecuta las validaciones del schema
      }
    ).orFail(handleFailError);

    if (!user.isActive) {
      return res.status(404).json({
        message: "Usuario no encontrado o inactivo",
      });
    }

    res.json({
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
    next(error);
  }
};

// Actualizar avatar del usuario
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

    res.json({
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
    next(error);
  }
};

// Obtener todos los usuarios (para admin o funciones especiales)
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

// Desactivar cuenta (soft delete)
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
