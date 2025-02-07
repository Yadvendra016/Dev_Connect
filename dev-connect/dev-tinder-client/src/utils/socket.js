import io from "socket.io-client";

export const createSockectConnection = () => {
  if (location.hostname === "localhost") {
    return io(import.meta.env.VITE_BACKEND_URI);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
