//alert for accepting the rules 

//load from supabase this need to migrate in .env
let apilink_ = window.location.origin + "/apikey/";

async function f() {
  const response = await fetch(apilink_); //error here because of url conflict
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
  const data_ = await response.json();
  
  const supabase_ = window.supabase.createClient(data_.supabaseurl, data_.supabasekey);

// Handle sign-up form submission
document.getElementById('submit_').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const full_name = document.getElementById('full_name').value;

    const message = document.getElementById('message');
    let mes = document.createElement('p');
    mes.className = "mt-4 text-center text-sm text-red-500";
    mes.textContent = "please check your email for confirmation.";
    message.appendChild(mes);
    //message.textContent = "please check your email for confirmation."

    const { data, error } = await supabase_.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        }
      }
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Sign-up successful! Please check your email for confirmation.');
      //window.location.href = './signin.html';
      window.location.href = window.location.origin + '/signin/';

    }

    cooldown = true;
    setTimeout(() => {
        cooldown = false;
    }, 600000); // 1-minute cooldown
  });
}

f();

//debut
/*
const supabase_ = supabase.createClient(supabaseUrl, supabaseKey);

// Handle sign-up form submission
document.getElementById('submit_').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const full_name = document.getElementById('full_name').value;

    const message = document.getElementById('message');
    let mes = document.createElement('p');
    mes.className = "mt-4 text-center text-sm text-red-500";
    mes.textContent = "please check your email for confirmation.";
    message.appendChild(mes);
    //message.textContent = "please check your email for confirmation."

    const { data, error } = await supabase_.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        }
      }
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Sign-up successful! Please check your email for confirmation.');
      window.location.href = './signin.html';
    }

    cooldown = true;
    setTimeout(() => {
        cooldown = false;
    }, 600000); // 1-minute cooldown
  });
  */
