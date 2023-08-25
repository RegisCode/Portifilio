const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["hard", "fun", "a journey", "LIFE"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
  	setTimeout(erase, newTextDelay);
  }
}

function erase() {
	if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() { 
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// Chamando segunda paginação
document.addEventListener('DOMContentLoaded', function() {
  const saibaMaisButton = document.getElementById("saibaMaisButton");
  
  if (saibaMaisButton) {
    saibaMaisButton.addEventListener("click", function() {
      window.location.href = "/principal/Conteudo/Conteudo.html"; // Redirecionar para conteudo.html
    });
  }
});

// Controlador quando o botão for clicado para abrir e fechar no menu
document.addEventListener('DOMContentLoaded', function() {
  const navicon = document.getElementById("navicon");
  const nav = document.querySelector("nav");

  navicon.addEventListener("click", function() {
    nav.classList.toggle("active");
  });

  // Fechar o menu quando um link dentro dele for clicado
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", function() {
      nav.classList.remove("active");
    });
  });
});

// Envio de e-mail
document.getElementById("enviarBtn").addEventListener("click", function() {
  // Aqui você pode adicionar o código que deseja executar após clicar em "ENVIAR"
  alert("Obrigado por entrar em contato!");
  // Ou você pode redefinir os campos do formulário, por exemplo:
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("comments").value = "";
});

// menu animado

