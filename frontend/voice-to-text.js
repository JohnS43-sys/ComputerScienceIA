// Detect the browser's speech recognition API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

//create a new speech recognition instance and set it to english
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
//only return final results
recognition.interimResults = false;

//start recording users voice
function startRecording() {
  recognition.start();
}

//Make the startRecording function global
window.startRecording = startRecording;

//Once a speech input has been recieved, run the following
recognition.onresult = (event) => {
  //extract transcript from the results of the recognition
  const transcript = event.results[0][0].transcript;
  //set the text content of "text-box" equal to the transcript
  document.getElementById("text-box").textContent = transcript;
  //save the transcript to the database
  window.saveMessage(transcript);
};

//error handler if there is an issue with speech recognition
recognition.onerror = (e) => console.error("Speech error:", e.error);
