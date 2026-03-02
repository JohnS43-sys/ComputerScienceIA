const STORAGE_KEY = "commonPhrases";

function getPhrasesFromDOM() {
  return Array.from(
    document.querySelectorAll("#phraseList .phrase-text")
  ).map(el => el.textContent.trim());
}

function savePhrases() {
  const phrases = getPhrasesFromDOM();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
}

function renderPhrases(phrases) {
  const phraseList = document.getElementById("phraseList");
  phraseList.innerHTML = "";

  phrases.forEach(text => {
    const li = document.createElement("li");
    li.className = "commonly-used-phrase";

    li.innerHTML = `
      <span class="phrase-text" onclick="sendShortcut(this)">
        ${text}
      </span>
      <button class="edit-btn" onclick="editShortcut(this)">✏️</button>
      <button class="delete-btn" onclick="deleteShortcut(this)">🗑️</button>
    `;

    phraseList.appendChild(li);
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
    savePhrases();
  }
}

function addNewPhrase() {
  const newPhraseText = prompt("Enter the new shortcut text:");

  if (newPhraseText && newPhraseText.trim() !== "") {
    const phraseList = document.getElementById("phraseList");

    const newPhraseItem = document.createElement("li");
    newPhraseItem.className = "commonly-used-phrase";

    newPhraseItem.innerHTML = `
      <span class="phrase-text" onclick="sendShortcut(this)">
        ${newPhraseText.trim()}
      </span>
      <button class="edit-btn" onclick="editShortcut(this)">✏️</button>
      <button class="delete-btn" onclick="deleteShortcut(this)">🗑️</button>
    `;

    phraseList.appendChild(newPhraseItem);
    savePhrases();
  }
}

function editShortcut(button) {
  const phraseElement = button.closest(".commonly-used-phrase");
  const phraseText = phraseElement.querySelector(".phrase-text");

  const newText = prompt("Edit the shortcut text:", phraseText.textContent);

  if (newText && newText.trim() !== "") {
    phraseText.textContent = newText.trim();
    savePhrases();
  }
}

function deleteShortcut(button) {
  const phraseElement = button.closest(".commonly-used-phrase");
  phraseElement.remove();
  savePhrases();
}

function sendShortcut(element) {
  const phraseText = element.textContent.trim();

  if (phraseText && window.saveMessage) {
    window.saveMessage(phraseText);
  }
}

document.addEventListener("DOMContentLoaded", loadPhrases);