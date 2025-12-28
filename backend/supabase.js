// supabase setup (GLOBAL)
window.supabaseClient = supabase.createClient(
  "https://dghkbvyvwhcfavpggyxq.supabase.co",
  "sb_publishable_Rkeis3BxPAqF3WEPkvCxHA_3TFCmZpn"
);

function saveMessage(transcript) {
  if (!window.currentConversationId) {
    alert("No conversation selected!");
    return;
  }

  window.supabaseClient
    .from("messages")
    .insert({
      content: transcript,
      conversation_id: window.currentConversationId
    })
    .then(({ error }) => {
      if (error) console.error(error);
    });
}

// make globally available
window.saveMessage = saveMessage;
