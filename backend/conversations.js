// conversations.js
// Assumes supabaseClient is defined globally in ../backend/supabase.js

function setCurrentConversation(id, title) {
  window.currentConversationId = id;
  sessionStorage.setItem("currentConversationId", String(id));
  sessionStorage.setItem("currentConversationTitle", title);

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el) el.textContent = "Current Conversation: " + title;
}

window.setCurrentConversation = setCurrentConversation;

function createConversation() {
  const conversationName = prompt("Please enter the conversation name", "");
  if (!conversationName) return;

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el) el.textContent = "Current Conversation: " + conversationName;

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
      renderConversationList(); // refresh list immediately
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

      if (data) setCurrentConversation(data.id, data.title);
    });
}

window.loadRecentConversation = loadRecentConversation;

// Pick whichever list exists on the current page (Home dropdown or Search list)
function getConversationListElement() {
  return (
    document.getElementById("conversation-list") ||
    document.getElementById("conversation-list-search")
  );
}

async function renderConversationList() {
  const conversationList = getConversationListElement();
  if (!conversationList) {
    console.warn("No conversation list element found on this page.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return;
  }

  conversationList.innerHTML = "";

  data.forEach((conversation) => {
    const listItem = document.createElement("li");
    listItem.className = "conversation-item";
    listItem.textContent = conversation.title;

    // EDIT button
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.innerHTML = "✏️";

    editButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const newTitle = prompt("Edit conversation title:", conversation.title);
      if (!newTitle || newTitle.trim() === "") return;

      const trimmed = newTitle.trim();

      const { error } = await supabaseClient
        .from("conversations")
        .update({ title: trimmed })
        .eq("id", conversation.id);

      if (error) {
        console.error("Error updating conversation title:", error);
        return;
      }

      // update UI + sessionStorage if current
      listItem.childNodes[0].nodeValue = trimmed;
      if (sessionStorage.getItem("currentConversationId") === String(conversation.id)) {
        sessionStorage.setItem("currentConversationTitle", trimmed);
        const el = document.getElementsByClassName("current-conversation")[0];
        if (el) el.textContent = "Current Conversation: " + trimmed;
      }
    });

    // DELETE button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = "🗑️";

    deleteButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!confirm("Are you sure you want to delete this conversation?")) return;

      const convId = conversation.id; // keep original type from DB

      // 1) delete messages first (avoid FK constraint)
      const { error: msgErr } = await supabaseClient
        .from("messages")
        .delete()
        .eq("conversation_id", convId);

      if (msgErr) {
        console.error("Error deleting messages:", msgErr);
        alert("Could not delete messages: " + msgErr.message);
        return;
      }

      // 2) delete conversation
      const { error: convErr } = await supabaseClient
        .from("conversations")
        .delete()
        .eq("id", convId);

      if (convErr) {
        console.error("Error deleting conversation:", convErr);
        alert("Could not delete conversation: " + convErr.message);
        return;
      }

      listItem.remove();

      // If user deleted the currently selected conversation, clear selection
      const currentId = sessionStorage.getItem("currentConversationId");
      if (String(currentId) === String(conversation.id)) {
        sessionStorage.removeItem("currentConversationId");
        sessionStorage.removeItem("currentConversationTitle");
        window.currentConversationId = null;

        const el = document.getElementsByClassName("current-conversation")[0];
        if (el) el.textContent = "Current Conversation: None";
      }
    });

    // click item (go to chat view) — BUT ignore clicks on buttons
    listItem.addEventListener("click", (e) => {
      if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) return;

      sessionStorage.setItem("currentConversationId", String(conversation.id));
      sessionStorage.setItem("currentConversationTitle", conversation.title);
      window.location.href = "screen3.html";
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    conversationList.appendChild(listItem);
  });
}

window.renderConversationList = renderConversationList;

// On page load: restore current conversation + render list
document.addEventListener("DOMContentLoaded", () => {
  const savedId = sessionStorage.getItem("currentConversationId");
  const savedTitle = sessionStorage.getItem("currentConversationTitle");

  if (savedId) window.currentConversationId = savedId;

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el && savedTitle) el.textContent = "Current Conversation: " + savedTitle;

  renderConversationList();
});
