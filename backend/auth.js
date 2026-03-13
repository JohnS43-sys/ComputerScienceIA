function showAuthMessage(message, isError = false) {
  const el = document.getElementById("auth-message");
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? "#d9534f" : "#2e7d32";
}

async function signUpUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showAuthMessage("Please enter both email and password.", true);
    return;
  }

  const { error } = await window.supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error("Signup error:", error.message);
    showAuthMessage(error.message, true);
    return;
  }

  showAuthMessage("Account created. Check your email for confirmation if enabled.");
}

async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showAuthMessage("Please enter both email and password.", true);
    return;
  }

  const { error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login error:", error.message);
    showAuthMessage(error.message, true);
    return;
  }

  window.location.href = "index.html";
}

async function logoutUser() {
  const { error } = await window.supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return;
  }

  sessionStorage.clear();
  window.location.href = "auth.html";
}

async function protectPage() {
  const {
    data: { session }
  } = await window.supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "auth.html";
  }
}

async function redirectIfLoggedIn() {
  const {
    data: { session }
  } = await window.supabaseClient.auth.getSession();

  if (session) {
    window.location.href = "index.html";
  }
}

window.redirectIfLoggedIn = redirectIfLoggedIn;

window.signUpUser = signUpUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.protectPage = protectPage;