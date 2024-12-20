import { Server as SocketIOServer } from "socket.io";
import { headers } from "next/headers";

// Declare the global variable `io` if it is not defined
declare global {
  var io: SocketIOServer | undefined;
}

export async function GET() {
  const headersList = headers();

  // Initialize globalThis.io if it hasn't been initialized yet
  if (!globalThis.io) {
    console.log("Initializing Socket.IO server...");

    // Create a new Socket.IO server instance
    globalThis.io = new SocketIOServer({
      path: "/api/socket",
      addTrailingSlash: false,
    });

    // Attach event listeners
    globalThis.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // Handle other socket events here
    });
  }

  // Return a simple response to confirm the initialization
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
