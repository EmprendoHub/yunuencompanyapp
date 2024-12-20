import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";

interface Comment {
  message: string;
  userName: string;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const socketServer = res.socket as any;

  // Check if the Socket.IO server is already initialized
  if (!socketServer.server.io) {
    const httpServer: HTTPServer = socketServer.server;
    const io = new IOServer(httpServer);
    socketServer.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("newComment", (comment: Comment) => {
        io.emit("commentAdded", comment);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    console.log("Socket.IO server initialized");
  }

  res.end();
};

export default SocketHandler;
