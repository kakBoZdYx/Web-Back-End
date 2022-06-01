let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}
window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}
function login() {
  var username = document.getElementById('usernamelog').value;
  var password = document.getElementById('passwordlog').value;
  if(username != getCookie('username') || password != getCookie('password')){
    alert('Username or password is incorrect');
    // document.getElementById("idname").textContent='Username or password is incorrect';
  }
  else {
    alert('Welcome to the site, ' + username);
  }
}

function getCookie(c_name) {
  if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end));
      }
  }
  return "";
}

function register() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  document.cookie = "username=" + username;
  document.cookie = "password=" + password;
  alert('Congrats! You have signed up!');
}




const form = document.getElementById('form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const weight = getInputNumberValue("weight");
  const height = getInputNumberValue("height");
  const age = getInputNumberValue("age");
  const gender = getSelectedValue("gender");
  const activityLevel = getSelectedValue("activity__level");

  const basal = Math.round(
    gender === 'female'
      ? (655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age))
      : (66.5 + (13.75 * weight) + (5.003 * height) - (6.775 * age))
  );

  const maintenance = Math.round(basal * Number(activityLevel));
  const gainWeight = maintenance + 450;
  const loseWeight = maintenance - 450;


  document.getElementById("outMaintenance");
  outMaintenance.innerHTML = "Для поддержания веса " + maintenance + " ккал" ;

  document.getElementById("outLoseweight");
  outLoseWeight.innerHTML = "Для снижения веса " + loseWeight + " ккал" ;

  document.getElementById("outGainWeight");
  outGainWeight.innerHTML = "Для набора веса " + gainWeight + " ккал" ;
}

function getSelectedValue(id) {
  const select = document.getElementById(id);
  return select.options[select.selectedIndex].value;
}

function getInputNumberValue(id) {
  return Number(document.getElementById(id).value);
}
