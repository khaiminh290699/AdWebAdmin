import io from "socket.io-client";

class Socket {
  constructor() {};
  connect = async (namespace) => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      console.log(`${process.env.REACT_APP_SOCKET_SERVER || "http://localhost:3002"}/${namespace}`)
      const socket = io(`${process.env.REACT_APP_SOCKET_SERVER || "http://localhost:3002"}/${namespace}`, {
        auth: { token },
        transports: ["polling"],
        reconnection: false
      });
    
      socket.on("connect", () => {
        return resolve(socket);
      });
  
      socket.on("connect_error", (err) => {
        console.log(err)
        return reject(err);
      });
  
    })
  }
}

export default Socket;