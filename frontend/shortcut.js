function editShortcut(button) {
    console.log("Edit shortcut button clicked");
    const phraseElement = button.closest('.commonly-used-phrase');
    const phraseText = phraseElement.querySelector('.phrase-text').textContent;
    // Function to edit a shortcut
    const newText = prompt("Edit the shortcut text:");  

    if (newText !== null && newText.trim() !== "") {
        phraseElement.querySelector('.phrase-text').textContent = newText.trim();
    }
}  


function addNewPhrase() {
    console.log("Add new phrase button clicked");
    const phraseList = document.getElementById('phraseList');
    const newPhraseText = prompt("Enter the new shortcut text:");
    if (newPhraseText !== null && newPhraseText.trim() !== "") {
        const newPhraseItem = document.createElement('li');
        newPhraseItem.className = 'commonly-used-phrase';
        newPhraseItem.innerHTML = `
            <span class="phrase-text">${newPhraseText.trim()}</span>
            <button class="edit-btn" onclick="editShortcut(this)">✏️</button>
            <button class="delete-btn" onclick="deleteShortcut(this)">🗑️</button>
        `;
        phraseList.appendChild(newPhraseItem);
    }


}

function deleteShortcut(button) {
    // Function to delete a shortcut
    const phraseElement = button.closest('.commonly-used-phrase');
    phraseElement.remove();  
}
