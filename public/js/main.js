import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

//get URL search params to pass to server when connecting user to room
const params = new URLSearchParams(window.location.search.slice(1));

const data = {
  name: params.get("username"),
  room: params.get("room"),
};

const msgForm = document.getElementById("chat-form");
const chatArea = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

roomName.innerText = data.room;

socket.emit("join-room", data);

msgForm.addEventListener("submit", (e) => {
  //prevent page reloading
  e.preventDefault();

  //send user entered text value to server
  const msgInput = e.target.msg;
  socket.emit("send-msg", msgInput.value);

  //reset input form and focus on it.
  msgInput.value = "";
  msgInput.focus();
});

socket.on("alert", (alertMsg) => {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert");
  alertDiv.innerText = alertMsg;
  chatArea.append(alertDiv);
});

socket.on("new-msg", (msg) => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `
    <p class="meta">${msg.name} <span>${msg.time}</span></p>
    <p class="text">${msg.msg}</p>`;
  chatArea.append(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
});

socket.on("update-users", (users) => {
  //clear users list before populating again.
  usersList.innerHTML = "";
  users.forEach((user) => {
    const usersListItem = document.createElement("li");
    usersListItem.innerText = user.name;
    usersList.append(usersListItem);
  });
});
