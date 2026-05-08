const socket = io("https://my-backend-2241.onrender.com");

const chat = document.getElementById("chat");
const status = document.getElementById("status");

// JOIN after connection
socket.on("connect", () => {
  socket.emit("join");
  status.innerText = "Connected. Waiting for partner...";
});

// MATCHED
socket.on("matched", () => {
  status.innerText = "Matched with stranger!";
});

// MESSAGE RECEIVE
socket.on("message", (msg) => {
  chat.innerHTML += `<p>Stranger: ${msg}</p>`;
});

// PARTNER LEFT
socket.on("partner-left", () => {
  status.innerText = "Partner left. Waiting...";
});

// SEND MESSAGE
function send() {
  const input = document.getElementById("msg");
  const msg = input.value;

  if (!msg) return;

  socket.emit("message", msg);

  chat.innerHTML += `<p>You: ${msg}</p>`;
  input.value = "";
}

// EMOJI
function sendEmoji(e) {
  socket.emit("message", e);
  chat.innerHTML += `<p>You: ${e}</p>`;
}

// NEXT USER
function nextUser() {
  socket.emit("next");
  chat.innerHTML = "";
  status.innerText = "Waiting for partner...";
}
