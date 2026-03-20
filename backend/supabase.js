window.supabaseClient = supabase.createClient(
  "https://dghkbvyvwhcfavpggyxq.supabase.co",
  "sb_publishable_Rkeis3BxPAqF3WEPkvCxHA_3TFCmZpn"
);

function saveMessage(transcript) {
  //Ensure a conversation is selected before saving the message
  if (!window.currentConversationId) {
    alert("No conversation selected!");
    return;
  }

  //Store transcripted speech into 'messageses' table
  window.supabaseClient
    .from("messages")
    .insert({
      content: transcript,
      //linkmessage to the currently active conversation ID
      conversation_id: window.currentConversationId
    })

    //handle any errors
    .then(({ error }) => {
      if (error) console.error(error);
    });
}

window.saveMessage = saveMessage;
