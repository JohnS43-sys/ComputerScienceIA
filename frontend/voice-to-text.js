const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

function startRecording() {
  recognition.start();
}

window.startRecording = startRecording;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById("text-box").textContent = transcript;

  // IMPORTANT — now this exists on window
  window.saveMessage(transcript);
};

recognition.onerror = (e) => console.error("Speech error:", e.error);
