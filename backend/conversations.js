function createConversation() {
  let conversationName = prompt("Please enter the conversation name", "");
  document.getElementsByClassName("current-conversation")[0].textContent = "Current Conversation: " + conversationName;
  
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


function loadConversation() {
  supabaseClient
    .from("conversations")
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
    .then(({ data, error }) => {
      console.log("LoadConversations() result:", data, error); 
      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      if(data) {
      document.getElementsByClassName("current-conversation")[0].textContent = "Current Conversation: " + data.title;
      console.log("Current conversation ID set to:", data.title);
      }
    });

}


function renderConversationsList() {
  supabaseClient
    .from("conversations")
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      console.log("RenderConversationsList() result:", data, error); 
      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }
      const conversationsList = document.getElementById("conversationsList");
      conversationsList.innerHTML = ""; // Clear existing list

      data.forEach(conversation => {
        const listItem = document.createElement("li");
        listItem.textContent = conversation.title;
        conversationsList.appendChild(listItem);
      }