/* =======================
   DOM ELEMENTS (FIRST)
======================= */
const chat = document.getElementById("chat");
const status = document.getElementById("status");

/* =======================
   SOCKET CONNECTION
======================= */
const socket = io("https://my-backend-2241.onrender.com");

/* =======================
   JOIN CHAT
======================= */
socket.on("connect", () => {
  socket.emit("join");
  status.innerText = "Connected. Waiting for partner...";
});

/* =======================
   MATCHED
======================= */
socket.on("matched", () => {
  status.innerText = "Matched with stranger!";
});

/* =======================
   TEXT MESSAGE RECEIVE
======================= */
socket.on("message", (msg) => {
  chat.innerHTML += `<p>Stranger: ${msg}</p>`;
});

/* =======================
   AUDIO RECEIVE (FIXED)
======================= */
socket.on("audio", (data) => {
  const audio = new Audio(data);
  audio.play();

  chat.innerHTML += `<p>🔊 Voice message received</p>`;
});

/* =======================
   PARTNER LEFT
======================= */
socket.on("partner-left", () => {
  status.innerText = "Partner left. Waiting...";
});

/* =======================
   SEND MESSAGE
======================= */
function send() {
  const input = document.getElementById("msg");
  const msg = input.value.trim();

  if (!msg) return;

  socket.emit("message", msg);

  chat.innerHTML += `<p>You: ${msg}</p>`;
  input.value = "";
}

/* =======================
   EMOJI
======================= */
function sendEmoji(e) {
  socket.emit("message", e);
  chat.innerHTML += `<p>You: ${e}</p>`;
}

/* =======================
   NEXT USER
======================= */
function nextUser() {
  socket.emit("next");
  chat.innerHTML = "";
  status.innerText = "Waiting for partner...";
}

/* =======================
   AUDIO RECORDING
======================= */
let mediaRecorder;
let audioChunks = [];

/* START RECORDING */
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = []; // IMPORTANT RESET

  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);

    reader.onloadend = () => {
      socket.emit("audio", reader.result);
    };
  };

  mediaRecorder.start();
}

/* STOP RECORDING */
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}
