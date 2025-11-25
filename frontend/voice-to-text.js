import { saveMessage } from '../backend/supabase.js';
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;
window.startRecording = startRecording;

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
  document.getElementById("text-box").innerHTML = transcript;
  saveMessage(transcript);
};

recognition.onspeechend = () => {
    recognition.stop();
    console.log("Recording Stopped")
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
}



