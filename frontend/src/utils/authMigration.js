export const migrateAuthData = () => {
  try {
    const currentUserData = localStorage.getItem("currentUser");
    const existingToken = localStorage.getItem("jwt");

    if (currentUserData) {
      try {
        const userData = JSON.parse(currentUserData);

        if (userData.token) {
          if (!existingToken) {
            localStorage.setItem("jwt", userData.token);
          }

          const { ...cleanUser } = userData;
          localStorage.setItem("currentUser", JSON.stringify(cleanUser));
        }
      } catch (parseError) {
        console.error("Error al parsear datos de usuario:", parseError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error durante migración:", error);
    return false;
  }
};

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
