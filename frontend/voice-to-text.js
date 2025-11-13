function startRecording() {
    console.log("Recording started");
    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

}

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
let lastTranscript = ''; 

const button = document.querySelector('.button1');

button.addEventListener('click', () => {
    recognition.start();
    console.log('Ready to receive a voice command.');
});

recognition.onresult = (event) => {
  lastTranscript = event.results[0][0].transcript;
  diagnostic.textContent = `Result received: ${lastTranscript}.`;
  console.log(`Confidence: ${event.results[0][0].confidence}`);
};

recognition.onspeechend = () => {
    console.log("Recording stopped");
  recognition.stop();
  console.log(lastTranscript)
};