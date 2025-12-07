function createConversation() {
  let conversationName = prompt("Please enter the conversation name", "");
  if (!conversationName) return;

  supabaseClient
    .from("conversations")
    .insert({ title: conversationName })
    .select("*")   // <-- RETURNS THE ROW
    .then(({ data, error }) => {
      console.log("CreateConversation() result:", data, error);

      if (error) {
        console.error("Error creating conversation:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.error("ERROR: No data returned. This means RLS or schema issue.");
        return;
      }

      const conversation = data[0];
      window.currentConversationId = conversation.id;

      console.log("Current conversation ID set to:", window.currentConversationId);
    });
}

window.createConversation = createConversation;
