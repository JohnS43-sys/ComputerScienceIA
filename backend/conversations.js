function createConversation() {
  const conversationName = prompt("Please enter the conversation name", "");
  if (!conversationName) return;

  document.getElementsByClassName("current-conversation")[0].textContent =
    "Current Conversation: " + conversationName;

  supabaseClient
    .from("conversations")
    .insert({ title: conversationName })
    .select("*")
    .single()
    .then(({ data, error }) => {
      console.log("CreateConversation() result:", data, error);

      if (error) {
        console.error("Error creating conversation:", error);
        return;
      }

      window.currentConversationId = data.id;
      sessionStorage.setItem("currentConversationId", data.id);
      sessionStorage.setItem("currentConversationTitle", data.title);
      document.getElementsByClassName("current-conversation")[0].textContent =
        "Current Conversation: " + data.title;

      console.log("Current conversation ID set to:", window.currentConversationId);
    });
}

window.createConversation = createConversation;

function loadConversation() {
  supabaseClient
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
    .then(({ data, error }) => {
      console.log("LoadConversation() result:", data, error);

      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      if (data) {
        window.currentConversationId = data.id;
        sessionStorage.setItem("currentConversationId", data.id);
        sessionStorage.setItem("currentConversationTitle", data.title);
        document.getElementsByClassName("current-conversation")[0].textContent =
          "Current Conversation: " + data.title;

        
        console.log("Current conversation ID set to:", window.currentConversationId);
      }
    });
}

window.onload = function() {
  const savedConversationId = sessionStorage.getItem("currentConversationId");
  const savedConversationTitle = sessionStorage.getItem("currentConversationTitle");
  
  if(savedConversationId) window.currentConversationId = savedConversationId;
  if(savedConversationTitle && document.getElementsByClassName("current-conversation")[0]) {
    document.getElementsByClassName("current-conversation")[0].textContent = "Current Conversation: " + savedConversationTitle;
  }


  renderConversationList();
}

async function renderConversationList() {
  const { data, error } = await supabaseClient
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {  
    console.error("Error fetching conversations:", error);
    return;
  } 

  const conversationList = document.getElementById("conversation-list");
  conversationList.innerHTML = "";  

  data.forEach(conversation => {
    const listItem = document.createElement("li");
    listItem.className = "conversation-item";
    listItem.textContent = conversation.title;
    listItem.onclick = function() {
      sessionStorage.setItem("currentConversationId", conversation.id);
      sessionStorage.setItem("currentConversationTitle", conversation.title);
      window.location.href = "screen3.html";
  };

    conversationList.appendChild(listItem);
  });
} 


