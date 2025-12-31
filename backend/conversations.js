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

      setCurrentConversation(data.id, data.title);

      console.log("Current conversation ID set to:", window.currentConversationId);
    });
}

window.createConversation = createConversation;

function loadRecentConversation() {
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
        setCurrentConversation(data.id, data.title);
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
    
    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.innerHTML = "✏️";
    editButton.onclick = async function(event) {
      event.stopPropagation(); 
      const newTitle = prompt("Edit conversation title:", conversation.title);
      if (newTitle && newTitle.trim() !== "") {
        const { error } = await supabaseClient
          .from("conversations")
          .update({ title: newTitle.trim() })
          .eq("id", conversation.id);
        if (error) {
          console.error("Error updating conversation title:", error);
        } else {
          listItem.textContent = newTitle.trim();
          listItem.appendChild(editButton); 
        }
      }
    };
    listItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = "🗑️";
    deleteButton.onclick = async function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!confirm("Are you sure you want to delete this conversation?")) return;

  const convId =
    typeof conversation.id === "string" && conversation.id.trim() !== "" && !isNaN(Number(conversation.id))
      ? Number(conversation.id)
      : conversation.id;

  console.log("Deleting conversation:", {
    conversation_id_value: conversation.id,
    conversation_id_type: typeof conversation.id,
    normalized_id_value: convId,
    normalized_id_type: typeof convId
  });

  const { error: msgErr } = await supabaseClient
    .from("messages")
    .delete()
    .eq("conversation_id", convId);

  if (msgErr) {
    console.error("Error deleting messages:", msgErr);
    alert("Could not delete messages: " + msgErr.message);
    return;
  }

  const { error: convErr, count } = await supabaseClient
    .from("conversations")
    .delete({ count: "exact" })
    .eq("id", convId);

  if (convErr) {
    console.error("Error deleting conversation:", convErr);
    alert("Could not delete conversation: " + convErr.message);
    return;
  }

  if (count === 0) {
    alert("Nothing deleted (0 rows matched). See console log above for id/type.");
    return;
  }

  listItem.remove();

  const currentId = sessionStorage.getItem("currentConversationId");
  if (String(currentId) === String(conversation.id)) {
    sessionStorage.removeItem("currentConversationId");
    sessionStorage.removeItem("currentConversationTitle");
    window.currentConversationId = null;

    const el = document.getElementsByClassName("current-conversation")[0];
    if (el) el.textContent = "Current Conversation: None";
  }

  };
    listItem.appendChild(deleteButton);


    
    listItem.onclick = function(e) {
      if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) return;
      sessionStorage.setItem("currentConversationId", conversation.id);
      sessionStorage.setItem("currentConversationTitle", conversation.title);
      window.location.href = "screen3.html";
  };

    conversationList.appendChild(listItem);
  });
} 

window.onload = function() {
  supabaseClient
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }
      else{
        const conversationList = document.getElementById("conversationList");
        data.forEach(conversation => {
          const listItem = document.createElement("li");
          listItem.textContent = conversation.title;
          listItem.onclick = function() {
            setCurrentConversation(conversation.id, conversation.title);

          };
          conversationList.appendChild(listItem);
        });
      }
});
} 

function setCurrentConversation(id, title) {
  window.currentConversationId = id;
  sessionStorage.setItem("currentConversationId", id);
  sessionStorage.setItem("currentConversationTitle", title);

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el) {
    el.textContent = "Current Conversation: " + title;
  }
}

