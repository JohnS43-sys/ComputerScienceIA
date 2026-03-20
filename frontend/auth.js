async function signup() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  //validate email format before adding it to Supabase
  if(!validateEmail(email)){
    alert("invalid email, try again");
    return;
  }
  //Ensure password meets length requirement
  if (password.length < 6 ) {
  alert("Password must be at least 6 characters");
  return;
  }


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

//asynchronous function to handle user login
async function login() {

  //extract email and password values from the text input fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;


  //Query database to see if there is a match
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  //If no user is found or there is an error, display "invalid login"
  if (error || !data) {
    document.getElementById("message").textContent = "Invalid login";
    return;
  }
  //store login into localstorage so that the user stays logged in
  localStorage.setItem("loggedIn", "true");
  //redirect user to index.html page
  window.location.href = "index.html";
}

function logout() {
  //remove "loggedIn" property from local storage
  localStorage.removeItem("loggedIn");
  //redirect user to the login page
  window.location.href = "auth.html";
}

//Function to check if email follows proper formatting conventions (regex)
function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
  //returns true if the entered email follows provided pattern
  return pattern.test(email);
}


window.logout = logout;