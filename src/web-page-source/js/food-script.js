let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{

  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');

}

window.onscroll = () =>{

  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  if(window.scrollY > 60){
    document.querySelector('#scroll-top').classList.add('active');
  }else{
    document.querySelector('#scroll-top').classList.remove('active');
  }

}
function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
  setInterval(loader, 3000);
}
window.onload = fadeOut();




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

let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}
