document.addEventListener("DOMContentLoaded", () => {
    let socket = io();

    socket.on("user", data => {
        console.log(data);
        userNotification(data.username, data.connected);
    });
    
    document.getElementById("message-send").addEventListener("click", (e) => {
        e.preventDefault();
    });
});

const createMessage = (message, sender, currentUser = "") => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("w-100");

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("chat-message", "w-25", "mb-3");

    const user = document.createElement("p");
    user.classList.add("message-user", "rounded", "mb-1", "bg-light", "w-50", "text-center");
    user.textContent = sender;

    const body = document.createElement("p");
    body.classList.add("message-body", "rounded", "bg-light");
    body.textContent = message;

    if (sender === currentUser) {
        innerDiv.classList.add("current-user-message");
    }

    outerDiv.appendChild(innerDiv);
    innerDiv.appendChild(user);
    innerDiv.appendChild(body);

    document.getElementById("chat").appendChild(outerDiv);
}

const userNotification = (user, connected) => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("w-100", "user-connection-container");
    
    const small = document.createElement("small");
    small.classList.add("text-muted", "user-connection-text");
    small.textContent = `${user} has ${connected ? "" : "dis"}connected`;
    outerDiv.appendChild(small);

    document.getElementById("chat").appendChild(outerDiv);
}