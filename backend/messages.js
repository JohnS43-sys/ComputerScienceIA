function loadMessagesFromConversation(conversationId) {
  supabaseClient
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .then(({ data, error }) => {
      console.log("loadMessagesFromConversation() result:", data, error);

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

        const messageList = document.getElementById("messages-list");

      if (!messageList) {
        console.error("Missing message list element in HTML");
        return;
      }

      messageList.innerHTML = "";

      data.forEach((message) => {
        const li = document.createElement("li");
        li.className = "message-item";
        li.textContent = message.content;
        messageList.appendChild(li);
      });
    });
}

window.loadMessagesFromConversation = loadMessagesFromConversation;
