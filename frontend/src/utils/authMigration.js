/**
 * Utilidad para migrar datos de autenticación a la nueva estructura segura
 * Ejecutar una vez para limpiar tokens existentes en objetos de usuario
 */
export const migrateAuthData = () => {
  try {
    console.log("🔄 Iniciando migración de datos de autenticación...");

    // Leer datos actuales
    const currentUserData = localStorage.getItem("currentUser");
    const existingToken = localStorage.getItem("jwt");

    if (currentUserData) {
      try {
        const userData = JSON.parse(currentUserData);

        // Si el usuario tiene token embebido, extraerlo
        if (userData.token) {
          console.log("⚠️  Token encontrado en objeto usuario, migrando...");

          // Guardar token por separado si no existe
          if (!existingToken) {
            localStorage.setItem("jwt", userData.token);
            console.log("✅ Token migrado a almacenamiento separado");
          }

          // Limpiar usuario de token
          const { token, ...cleanUser } = userData;
          localStorage.setItem("currentUser", JSON.stringify(cleanUser));
          console.log("✅ Objeto usuario limpiado de token");
        }
      } catch (parseError) {
        console.error("Error al parsear datos de usuario:", parseError);
      }
    }

    console.log("✅ Migración completada");
    return true;
  } catch (error) {
    console.error("Error durante migración:", error);
    return false;
  }
};

/**
 * Verificar que no hay tokens en el objeto usuario
 */
export const validateCleanUserData = () => {
  try {
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      const userData = JSON.parse(currentUserData);
      if (userData.token) {
        console.warn("Alert: Token encontrado en objeto usuario!");
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error validando datos:", error);
    return false;
  }
};
