const STORAGE_KEY = "commonPhrases";
const MAX_PHRASES = 10;

function getPhrasesFromDOM() {
  return Array.from(
    document.querySelectorAll("#phraseList .phrase-text")
  ).map((el) => el.textContent.trim());
}

function savePhrases() {
  const phrases = getPhrasesFromDOM();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
}

function createPhraseItem(text) {
  const li = document.createElement("li");
  li.className = "commonly-used-phrase";

  const span = document.createElement("span");
  span.className = "phrase-text";
  span.textContent = text;

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.type = "button";
  editButton.textContent = "✏️";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.type = "button";
  deleteButton.textContent = "🗑️";

  //Make the shortcut behave like the default shortcut
  span.addEventListener("click", () => {
    sendShortcut(span);
  });

  editButton.addEventListener("click", () => {
    editShortcut(editButton);
  });

  deleteButton.addEventListener("click", () => {
    deleteShortcut(deleteButton);
  });

  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;
}

function renderPhrases(phrases) {
  const phraseList = document.getElementById("phraseList");
  if (!phraseList) return;

  phraseList.innerHTML = "";

  phrases.forEach((text) => {
    const trimmedText = text.trim();
    if (trimmedText !== "") {
      phraseList.appendChild(createPhraseItem(trimmedText));
    }
  });
}

function loadPhrases() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const phrases = JSON.parse(stored);
      renderPhrases(phrases);
    } catch (e) {
      console.error("Error loading phrases:", e);
    }
  } else {
    //Save the default phrase already written in the HTML
    savePhrases();
  }
}

function addNewPhrase() {
  const currentPhrases = getPhrasesFromDOM();

  if (currentPhrases.length >= MAX_PHRASES) {
    alert("You can only store up to 10 shortcuts.");
    return;
  }

  const newPhraseText = prompt("Enter the new shortcut text:");

  if (!newPhraseText || newPhraseText.trim() === "") {
    alert("Shortcut text cannot be empty.");
    return;
  }

  const trimmedText = newPhraseText.trim();

  const phraseList = document.getElementById("phraseList");
  phraseList.appendChild(createPhraseItem(trimmedText));
  savePhrases();
}

function editShortcut(button) {
  const phraseElement = button.closest(".commonly-used-phrase");
  const phraseText = phraseElement.querySelector(".phrase-text");

  const newText = prompt("Edit the shortcut text:", phraseText.textContent);

  if (!newText || newText.trim() === "") {
    alert("Shortcut text cannot be empty.");
    return;
  }

  phraseText.textContent = newText.trim();
  savePhrases();
}

function deleteShortcut(button) {
  const phraseElement = button.closest(".commonly-used-phrase");
  phraseElement.remove();
  savePhrases();
}

function sendShortcut(element) {
  const phraseText = element.textContent.trim();

  if (!phraseText) return;

  //Show the shortcut in the same text box used by speech recognition
  const textBox = document.getElementById("text-box");
  if (textBox) {
    textBox.textContent = phraseText;
  }

  //Save shortcut as a normal message
  if (window.saveMessage) {
    window.saveMessage(phraseText);
  }
}

//Make functions global so inline HTML can still access them if needed
window.addNewPhrase = addNewPhrase;
window.editShortcut = editShortcut;
window.deleteShortcut = deleteShortcut;
window.sendShortcut = sendShortcut;

document.addEventListener("DOMContentLoaded", loadPhrases);