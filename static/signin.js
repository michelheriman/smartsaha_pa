
//let apilink = "https://potential-couscous-q7qp9gv6j6gpf69x6-8000.app.github.dev/chat_box" //replace this by redirect in views
let apilink_ = window.location.origin + "/apikey/"; // replace this by apikey in views

async function signIn(email, password, supabase_) {
    const { data, error } = await supabase_.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error("Sign-in error:", error.message);
      alert("Error: " + error.message);
      return;
    }

    else{
  
    console.log("User signed in successfully:", data.user);
    alert("Welcome back, " + data.user.username + "!");
    //window.location.href = redirect // to be replaced by this
    window.location.href =  window.location.origin //apilink// to be replaced

    }
  }

document.getElementById("submit_").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch(apilink_);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
    const data_ = await response.json();
    const supabase_ = supabase.createClient(data_.supabaseurl, data_.supabasekey);
    await signIn(email, password, supabase_);
  });