export const getDomain = () => {
  if (import.meta.env.VITE_MODE == "dev") {
    return "http://localhost:5000";
  } else {
    return "https://code2place-api2.onrender.com";
  }
};
