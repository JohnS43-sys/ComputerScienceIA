document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ screen3 loaded");

  const conversationId = sessionStorage.getItem("currentConversationId");
  const title = sessionStorage.getItem("currentConversationTitle");

  console.log("✅ session conversationId:", conversationId);
  console.log("✅ session title:", title);
  console.log("✅ typeof loadMessagesFromConversation:", typeof window.loadMessagesFromConversation);
  console.log("✅ typeof supabaseClient:", typeof window.supabaseClient);
  console.log("✅ messages list exists:", !!document.getElementById("messages-list"));

  if (!conversationId) {
    console.warn("❌ No conversation selected in this session");
    return;
  }

  if (typeof window.loadMessagesFromConversation !== "function") {
    console.error("❌ messages.js not loaded or function not global");
    return;
  }

  window.loadMessagesFromConversation(conversationId);
});
