sessionStorage.setItem("mode", "history");
let token = sessionStorage.getItem("jwt");
if ( !token )
    window.location.replace(window.location.origin + "/login");

const socket = io(window.location.origin, {auth: {token: token} });
socket.on("disconnect", () => {
    console.log("DC");
});
socket.on("InvalidToken", () => {
    window.location.replace(window.location.origin + "/login");
});
socket.on("newRoom", (room) => {

    if (sessionStorage.getItem("mode") == "history") {
        clearMessages();
        socket.emit("getRoomLogs", room);
    }
    displayMessage(`Joined room: ${room}`, 1.2, "gray");
});
socket.on("newMessage", (sender, message) => {
    displayMessage(`${sender}: ${message}`);
});
socket.on("newError", (error) => {
    displayMessage(error, 1.2, "red");
});
socket.on("roomLogs", (logs) => {
    for (let log of logs)
        displayMessage(`${log.sender}: ${log.message}`);
});


function clearMessages() {
    const chat = document.getElementById("chat");
    chat.innerHTML = null;
}


function displayMessage(content, size=1, color="black") {
    const chat = document.getElementById("chat");
    chat.innerHTML += `<p style="color:${color}; font-size:${size}em">${content}</p>`;
}


function switchRoom(room) {
    socket.emit("switchRoom", room);
}


window.onload = () => {
    let buttons = document.getElementById("room_toggle").getElementsByTagName("button");
    for (let button of buttons)
        button.addEventListener("click", (event) => {switchRoom(button.innerHTML);});
}

window.sendMessage = () => {
    const message = document.getElementById("message_input").value;
    if (message)
        socket.emit("sendMessage", message);
}

window.toggleMode = () => {
    const button = document.getElementById("mode_toggle").getElementsByTagName("button")[0];
    if (button.innerHTML == "Mode: History") {
        button.innerHTML = "Mode: Switch";
        sessionStorage.setItem("mode", "switch");
    }
    else {
        button.innerHTML = "Mode: History";
        sessionStorage.setItem("mode", "history");
    }
}
