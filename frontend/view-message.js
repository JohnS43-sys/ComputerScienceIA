document.addEventListener("DOMContentLoaded", () => {
  console.log("screen3 loaded");

  const conversationId = sessionStorage.getItem("currentConversationId");
  const title = sessionStorage.getItem("currentConversationTitle");


  if (!conversationId) {
    console.warn("No conversation selected");
    return;
  }

  if (typeof window.loadMessagesFromConversation !== "function") {
    console.error(" messages.js not loaded");
    return;
  }

  window.loadMessagesFromConversation(conversationId);
});
