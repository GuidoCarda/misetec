export const getHeaders = () => {
  const authInfo = JSON.parse(localStorage.getItem("user") || "{}");
  const { role, token } = authInfo;

  if (role && token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
};
