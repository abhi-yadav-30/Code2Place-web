export const getDomain = () => {
    const mode="prod"
  if (mode == "dev") {
    return "http://localhost:5000";
  } else {
    return "https://code2place-api2.onrender.com";
  }
};
