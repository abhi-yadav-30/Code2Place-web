export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validatePassword = (password) => {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

  return regex.test(password);
};

export const sanitizeText = (text) => {
  // Removes leading/trailing spaces + multiple spaces
  return text.replace(/\s+/g, " ").trim();
};
