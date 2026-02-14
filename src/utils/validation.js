export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) return false;

  const popularDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "rvce.edu.in",
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  return popularDomains.includes(domain);
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
