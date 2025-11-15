
console.log("Recording started");
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;


const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function startRecording(){
  console.log('Ready to receive a voice command.');
  recognition.start();
} 
    


recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(transcript);
};

recognition.onspeechend = () => {
    recognition.stop();
    console.log("Recording Stopped")
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};