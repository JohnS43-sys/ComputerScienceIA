function createConversation() {
   let conversationName = prompt("Please enter the conversation name", "");
    if (conversationName == null || conversationName == "") {
    text = "User cancelled the prompt.";
    } else {
        supabaseClient
        .from("conversations")
        .insert({title : conversationName})
        .then(({ error }) => {
            if (error) console.error(error);
        });
    }
}

window.createConversation = createConversation;