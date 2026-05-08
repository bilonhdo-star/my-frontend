const socket = io("https://my-backend-2241.onrender.com");

const chat = document.getElementById("chat");
const status = document.getElementById("status");

socket.on("connect", () => {
  status.innerText = "Connected. Waiting for partner...";
});

socket.on("matched", () => {
  status.innerText = "Matched with stranger!";
});

socket.on("message", (msg) => {
  chat.innerHTML += "<p>" + msg + "</p>";
});

socket.on("partner-left", () => {
  status.innerText = "Partner left. Waiting...";
});

function send() {
  const msg = document.getElementById("msg").value;
  socket.emit("message", msg);
  chat.innerHTML += "<p>You: " + msg + "</p>";
}

function sendEmoji(e) {
  socket.emit("message", e);
  chat.innerHTML += "<p>You: " + e + "</p>";
}

function nextUser() {
  socket.emit("next");
  chat.innerHTML = "";
}
