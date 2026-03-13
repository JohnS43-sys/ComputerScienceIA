window.supabaseClient = supabase.createClient(
  "https://dghkbvyvwhcfavpggyxq.supabase.co",
  "sb_publishable_Rkeis3BxPAqF3WEPkvCxHA_3TFCmZpn"
);

async function saveMessage(transcript) {
  if (!window.currentConversationId) {
    alert("No conversation selected!");
    return;
  }

  const {
    data: { user }
  } = await window.supabaseClient.auth.getUser();

  if (!user) {
    alert("You must be logged in.");
    window.location.href = "auth.html";
    return;
  }

  const { error } = await window.supabaseClient
    .from("messages")
    .insert({
      content: transcript,
      conversation_id: window.currentConversationId,
      user_id: user.id
    });

  if (error) console.error(error);
}

window.saveMessage = saveMessage;
