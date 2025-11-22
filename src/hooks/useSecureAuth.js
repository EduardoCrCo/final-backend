//Hook personalizado para manejo seguro de autenticación

export const useSecureAuth = () => {
  // Funciones para manejo seguro del token
  const getToken = () => {
    return localStorage.getItem("jwt");
  };

  const setToken = (token) => {
    if (token) {
      localStorage.setItem("jwt", token);
    } else {
      localStorage.removeItem("jwt");
    }
  };

  const removeToken = () => {
    localStorage.removeItem("jwt");
  };

  const hasValidToken = () => {
    const token = getToken();
    return token !== null && token !== undefined && token !== "";
  };

  // Función para obtener headers de autorización
  const getAuthHeaders = () => {
    const token = getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  };

  return {
    getToken,
    setToken,
    removeToken,
    hasValidToken,
    getAuthHeaders,
  };
};
