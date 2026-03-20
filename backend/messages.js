console.log("messages.js loaded");

function loadMessagesFromConversation(conversationId) {
  console.log("✅ loadMessagesFromConversation() called with ID:", conversationId);
  //Retrieve all messages from the "messages" table
  window.supabaseClient
    .from("messages")
    .select("*")
    //filter messages to only retreive ones with the same conversation ID
    .eq("conversation_id", conversationId)
    //sort by recency, so that it is in chronological order
    .order("created_at", { ascending: true })
    .then(({ data, error }) => {
      console.log("✅ loadMessagesFromConversation() result:", data, error);

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      const messageList = document.getElementById("messages-list");
      if (!messageList) {
        console.error("Missing #messages-list in screen3.html");
        return;
      }

      messageList.innerHTML = "";

      //Loop through each message in the database (looping through 'data')
      data.forEach((message) => {
        //create li for each message
        const li = document.createElement("li");
        li.className = "message-item";
        //set the text of the li to the message content
        li.textContent = message.content;
        //add this to the message list component
        messageList.appendChild(li);
      });
    });
}

window.loadMessagesFromConversation = loadMessagesFromConversation;
