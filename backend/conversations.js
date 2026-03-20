function setCurrentConversation(id, title) {
  //store the selected conversation id so that it can be accessed globally
  window.currentConversationId = id;
  //save the conversation details in session storage so that it is persistent across all pages
  sessionStorage.setItem("currentConversationId", String(id));
  sessionStorage.setItem("currentConversationTitle", title);

  //update UI to show the currently selected conversation
  const el = document.getElementsByClassName("current-conversation")[0];
  //set el.text content to the current conversation's title
  if (el) el.textContent = "Current Conversation: " + title;
}

window.setCurrentConversation = setCurrentConversation;

function createConversation() {
  const conversationName = prompt("Please enter the conversation name", "");

  if (!conversationName || conversationName.trim() === "") {
  alert("Conversation name cannot be empty");
  return;
  }

  if (conversationName.length > 50) {
  alert("Conversation name too long");
  return;
  }

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el) el.textContent = "Current Conversation: " + conversationName;

  //Insert a conversation into "conversations" table with the conversationName as the title
  supabaseClient
    .from("conversations")
    .insert({ title: conversationName })
    .select("*")
    .single()
    //Error-handling for the Supabase response
    .then(({ data, error }) => {
      console.log("CreateConversation() result:", data, error);

      //End process if an error is caught
      if (error) {
        console.error("Error creating conversation:", error);
        return;
      }
      //set current conversation to the newly created conversation
      setCurrentConversation(data.id, data.title);
      //update the conversation list to include the newly added conversation
      renderConversationList(); 
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

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.innerHTML = "✏️";

    //add event when the edit button is clicked
    editButton.addEventListener("click", async (event) => {
      //prevent default behavior
      event.preventDefault();
      event.stopPropagation();

      newTitle = prompt("Enter the new conversation title:", conversation.title);
      //data validation to ensure the new title is not empty
      if (!newTitle || newTitle.trim() === "") {
      alert("Title cannot be empty");
      return;
      }
      //ensure the title is not too long
      if (newTitle.length > 50) {
      alert("Title too long");
      return;
    }
      //remove extra spaces
      const trimmed = newTitle.trim();

      //Update the title property in supabase if there are no errors
      const { error } = await supabaseClient
        .from("conversations")
        .update({ title: trimmed })
        .eq("id", conversation.id);
      //error handling
      if (error) {
        console.error("Error updating conversation title:", error);
        return;
      }
      //update the displayed title in the UI
      listItem.childNodes[0].nodeValue = trimmed;

      //if the current conversation is edited, update session storage
      if (sessionStorage.getItem("currentConversationId") === String(conversation.id)) {
        sessionStorage.setItem("currentConversationTitle", trimmed);
        const el = document.getElementsByClassName("current-conversation")[0];
        if (el) el.textContent = "Current Conversation: " + trimmed;
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = "🗑️";

    deleteButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!confirm("Are you sure you want to delete this conversation?")) return;

      const convId = conversation.id;
      //Delete all messages related to the convId
      const { error: msgErr } = await supabaseClient
        .from("messages")
        .delete()
        .eq("conversation_id", convId);
      //Error handling if there is an error deleting messages
      if (msgErr) {
        console.error("Error deleting messages:", msgErr);
        alert("Could not delete messages: " + msgErr.message);
        return;
      }
      //Delete conversation after deleting messages
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

      const currentId = sessionStorage.getItem("currentConversationId");
      if (String(currentId) === String(conversation.id)) {
        sessionStorage.removeItem("currentConversationId");
        sessionStorage.removeItem("currentConversationTitle");
        window.currentConversationId = null;

        const el = document.getElementsByClassName("current-conversation")[0];
        if (el) el.textContent = "Current Conversation: None";
      }
    });

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

document.addEventListener("DOMContentLoaded", () => {
  const savedId = sessionStorage.getItem("currentConversationId");
  const savedTitle = sessionStorage.getItem("currentConversationTitle");

  if (savedId) window.currentConversationId = savedId;

  const el = document.getElementsByClassName("current-conversation")[0];
  if (el && savedTitle) el.textContent = "Current Conversation: " + savedTitle;

  renderConversationList();
});


async function searchForConversation() {
  const query = document.querySelector('.search-bar').value;
  const conversationList = getConversationListElement();
  if (!conversationList) {
    console.warn("No conversation list element found on this page.");
    return;
  }
  const { data, error } = await supabaseClient
    .from("conversations")
    .select("*")
    .ilike("title", `%${query}%`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error searching conversations:", error);
    return;
  } 
  conversationList.innerHTML = "";
  data.forEach((conversation) => {
    const listItem = document.createElement("li");
    listItem.className = "conversation-item";
    listItem.textContent = conversation.title;
    listItem.addEventListener("click", () => {
      sessionStorage.setItem("currentConversationId", String(conversation.id));
      sessionStorage.setItem("currentConversationTitle", conversation.title);
      window.location.href = "screen3.html";
    },);
    conversationList.appendChild(listItem);
  });

  if (data.length === 0) {
    const noResultsItem = document.createElement("li");
    noResultsItem.className = "no-results";
    noResultsItem.textContent = "No conversations found.";
    noResultsItem.style.listStyleType = "none";
    conversationList.appendChild(noResultsItem);
  }
}