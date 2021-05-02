document.addEventListener("DOMContentLoaded", () => {
    let socket = io();
});

const createMessage = (message, sender, currentUser = "") => {
    const outerDiv = document.createElement("div").classList.add("w-100");
    const innerDiv = document.createElement("div").classList.add("chat-message", "w-25", "mb-3");
    const user = document.createElement("p").classList.add("message-user", "rounded", "mb-1", "bg-light", "w-50", "text-center")
    user.textContent = sender;
    const body = document.createElement("p").classList.add("message-body", "rounded", "bg-light");
    body.textContent = message;
    console.log(body);
}