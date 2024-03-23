function navigateForward() {
  window.history.forward();
}
function navigateBackward() {
  window.history.back();
}

if(document.readyState == 'loading'){
  document.addEventListener('DOMContentLoaded', ready)
}else{
  ready()
}


let signin_wrapper = document.getElementById('signin-wrapper');
let signup_wrapper = document.getElementById('signup-wrapper');
let loading = document.getElementById('loading_animi');
let success = document.getElementById('success_call');
let successText = document.getElementById('success_call_text');
var  existing_user = document.getElementById('password_error');

const username = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

let new_user = document.getElementById('new_user');
let registered_user = document.getElementById('registered_user');

function ready(){
  signup_wrapper.classList.remove('active') 
  signin_wrapper.classList.add('active') 
  loading.style.display = 'none'
  success.style.display = 'none'
}

new_user.addEventListener('click' ,() => {
  signup_wrapper.classList.add('active') 
  signin_wrapper.classList.remove('active') 
})

registered_user.addEventListener('click' ,() => {
  signup_wrapper.classList.remove('active') 
  signin_wrapper.classList.add('active') 
})




const scriptUrl = 'https://script.google.com/macros/s/AKfycbzhavC8t7QcWKp0ava47VjSDo6jadEIka3J2f227k3RNj4XDu_rnlHe_yuKufgbcp9i/exec';

document.getElementById('signup-btn').addEventListener('click', submitForm);

async function run() {
  function generateUniqueId() {
    const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
    return randomNumber.toString();
  }
  let userid = generateUniqueId()

  const registrationData = {
    uid: userid,
    name: username.value,
    email: email.value,
    password: password.value
  };
  const response = await fetch(scriptUrl, {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(registrationData),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
  const responseData = await response.json();
  console.log(responseData);
  console.log(response);
  if (responseData.status === 'success') {
    loading.style.display = 'none'
    registrationSuccess();
  } else if (responseData.status === 'error') {
    var count1;
    count1 = setInterval(countdown, 1000);
     var c = 5;
    function countdown () {
    existing_user.innerHTML = 'Email already registered Please Wait...' + --c + "s";
      if(c == 0){
        clearInterval(count1);
        username.value = ''
        email.value = ''
        password.value = ''
        existing_user.innerHTML = ''
        signin_wrapper.style.display = "block"
        signup_wrapper.style.display = "none"
      }
    }
  }
}
  function registrationSuccess() {
  success.style.display = "flex";
  successText.innerHTML = 'Registration Successful'

    setTimeout(() => {
      signin_wrapper.style.display = "block"
    signup_wrapper.style.display = "none"
    success.style.display = "none";
    }, 5000);
    
}


function submitForm() {
  signin_wrapper.style.display = 'none'
    signup_wrapper.style.display = 'none'
    loading.style.display = 'flex'
  var tovalidate = {
    name: "*Username Required",
    email: "*Enter valid email address",
    password: "*Enter password",
  };

  var allvalid = true;
  var idkeys = Object.keys(tovalidate);
  idkeys.forEach(function (id) {
    var isvalid = validationCheck(id, tovalidate[id]);
    
    if (!isvalid) {
     
      allvalid = false;
    }
  });

  if (allvalid) {
    run(); // Call the run function if all fields are valid
  }
}

function validationCheck(elID, message) {
  var elements = document.getElementById(elID);
  var validity = elements.checkValidity();
  var validityLabel = document.getElementById(elID +'_error');

  if (!validity) {
    validityLabel.textContent = message;
    return false;
  } else {
    validityLabel.textContent = ""; // Clear the error message if valid
    return true;
  }
}

// ============================================== LOGIN SECTION ================================================================

document.addEventListener('DOMContentLoaded', () => {

  const userEmail = getSession();
  if (userEmail) {
    signin_wrapper.style.display = 'none'
    signup_wrapper.style.display = 'none'
    loading.style.display = 'flex'
    setTimeout(() => {
      navigateToHomepage();
      loading.style.display = 'none'
    }, 1500);
  }
});

document.getElementById('login-btn').addEventListener('click', loginForm);
    
async function loginForm() {

  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const email_pass_error = document.getElementById('email_pass_error');

  if (loginEmail.value === '' || loginPassword.value === '') {
    email_pass_error.innerHTML = 'Email or password invalid, Try Again.';
    setTimeout(() => {
      email_pass_error.innerHTML = '';
    }, 3500);
    return false;
  }

    signin_wrapper.style.display = 'none'
    signup_wrapper.style.display = 'none'
    loading.style.display = 'flex'
  const logiData = await fetchlogiData();
  const userExists = checkUserExists(logiData, loginEmail.value, loginPassword.value);

  if (userExists) {
    signin_wrapper.style.display = 'none'
    signup_wrapper.style.display = 'none'
    loading.style.display = 'flex'
    setTimeout(() => {
      navigateToHomepage();
      loading.style.display = 'none'
    }, 1500);
    setSession(loginEmail.value);
    localStorage.setItem('userEmail', loginEmail.value);
    navigateToHomepage();
  } else {
    signin_wrapper.style.display = 'block'
    signup_wrapper.style.display = 'none'
    loading.style.display = 'none'
    email_pass_error.innerHTML = 'Email or password invalid, Try Again.';
    loginEmail.value = '';
    loginPassword.value = '';
    setTimeout(() => {
      email_pass_error.innerHTML = '';
    }, 3500);
  }
}
async function fetchlogiData() {
  try {
    const response = await fetch(scriptUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching login data:', error);
    return [];
  }
}

function checkUserExists(logiData, email, password) {
  const userExists = logiData.some(user => user[1] === email && user[2] === password);
  return userExists;
}

function setSession(email) {
  document.cookie = `userEmail=${email}; expires=${getCookieExpirationDate()}; path=/`;
}

function getSession() {
  const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
  return cookieValue;
}

function clearSession() {
  document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

function getCookieExpirationDate() {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate.toUTCString();
}

function navigateToHomepage() {
  const linkHref = 'foodapp/user/home/index.html';
  window.location.href = linkHref;
}




