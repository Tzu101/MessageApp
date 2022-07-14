// Utility libaries
const jwt = require("jsonwebtoken");
const socketio = require('socket.io');


module.exports = function (connection) {

    const io = socketio(connection);

    const rooms = new Map();
    const defaultRoom = "General";
    rooms.set(defaultRoom, []);
    rooms.set("Memes", []);
    rooms.set("Cats", []);
    rooms.set("Bugs", []);

    // JWT token authentication
    io.on("connection", (socket) => {
        
        if (! socket.handshake.auth.token) {
            io.to(socket.id).emit("InvalidToken");
            socket.disconnect();
            return;
        }
        
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (error, token) => {
            
            if (error || !token.username) {
                io.to(socket.id).emit("InvalidToken");
                socket.disconnect();
                return;
            }

            io.to(socket.id).emit("newRoom", defaultRoom);
            socket.username = token.username;
            socket.room = defaultRoom;
            socket.join(defaultRoom);

            socket.on("switchRoom", (room) => {

                if (rooms.has(room)) {
                    io.to(socket.id).emit("newRoom", room);
                    socket.leave(socket.room);
                    socket.room = room;
                    socket.join(room);
                }
                else {
                    io.to(socket.id).emit("newError", `No such room: ${room}`);
                }
            });

            socket.on("sendMessage", (message) => {

                const room = socket.room;
                if (rooms.has(room)) {
                    io.in(room).emit("newMessage", socket.username, message);
                    rooms.get(room).push({sender: socket.username, message: message});
                }   
                else {
                    io.to(socket.id).emit("newError", `No such room: ${room}`);
                }
            });

            socket.on("getRoomLogs", (room) => {
                if (rooms.has(room))
                    io.to(socket.id).emit("roomLogs", rooms.get(room));
            })
        });
    });
}