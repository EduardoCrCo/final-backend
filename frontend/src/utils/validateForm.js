export const validateForm = (form) => {
  if (!form) {
    return { form: "El formulario no existe" };
  }
  const newErrors = {};
  if (!form.name || !form.name.trim())
    newErrors.name = "El nombre es obligatorio";

  if (!form.email || !form.email.trim())
    newErrors.email = "El correo es obligatorio";
  else if (!/\S+@\S+\.\S+/.test(form.email))
    newErrors.email = "Correo electrónico no válido";

  if (!form.password) newErrors.password = "La contraseña es obligatoria";
  else if (form.password.length < 8)
    newErrors.password = "La contraseña debe tener al menos 8 caracteres";

  if (form.password !== form.confirmPassword)
    newErrors.confirmPassword = "Las contraseñas no coinciden";
  return newErrors;
};
