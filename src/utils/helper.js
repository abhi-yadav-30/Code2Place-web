export const getDomain = () => {
  if (import.meta.env.VITE_MODE == "dev") {
    const hostname = window.location.hostname;
console.log(hostname)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    } else if (hostname.startsWith("192.168.")) {
      // Production domain
      return "http://192.168.1.37:5000";
    }
  } else {
    return "https://code2place-api2.onrender.com";
  }
};
