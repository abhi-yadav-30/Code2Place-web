export const getDomain = () => {
  if (import.meta.env.VITE_MODE == "prod")
    return "https://code2place-api2.onrender.com";
  else return "http://localhost:5000";
};
