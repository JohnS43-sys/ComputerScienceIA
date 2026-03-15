async function signup() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient
    .from("users")
    .insert({
      email: email,
      password: password
    });

  if (error) {
    document.getElementById("message").textContent = "Signup failed";
    return;
  }

  document.getElementById("message").textContent = "Account created!";
}

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    document.getElementById("message").textContent = "Invalid login";
    return;
  }

  localStorage.setItem("loggedIn", "true");

  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "auth.html";
}

window.logout = logout;