  const supabaseClient = supabase.createClient('https://dghkbvyvwhcfavpggyxq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaGtidnl2d2hjZmF2cGdneXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTc0NjUsImV4cCI6MjA3OTU5MzQ2NX0.gEwxiXsBOHQdd-UTc2nxlzD1GQtTvrEH1p3ZcXfC-Mw');

  function saveMessage(transcript) {

    if(!window.currentConversationId){
      alert("No conversation selected!");
      return;
    }
    supabaseClient
      .from("messages")
      .insert({ content: transcript, conversation_id: window.currentConversationId })
      .then(({ error }) => {
        if (error) console.error(error);
    });
}

// make globally available
window.saveMessage = saveMessage;